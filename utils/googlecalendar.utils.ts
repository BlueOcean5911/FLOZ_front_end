import axios, { AxiosRequestConfig } from "axios";
import refreshAccessToken from "./refreshGoogleOAuthToken";
import { Meeting } from "@models";
import moment from "moment";
import { getDateAddedByMinutes } from "./dateFunc.utils";
import { signOut } from "next-auth/react";
import { getCookie } from "cookies-next";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events/";

function fetchGoogleEvents(accessToken, refreshToken) {
  return new Promise((resolve, reject) => {
    axios.get(GOOGLE_CALENDAR_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    }).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      console.log(err, "fetchGoogleEvnets function error!!!")
      if (err.response.status === 401) {
        return refreshAccessToken(refreshToken).then((newAccessToken) => {
          return fetchGoogleEvents(newAccessToken, refreshToken);
        }).then(resolve).catch(reject)
      } else {
        return reject(err)
      }
    });
  })
}

function putEventIntoGoogleCalendar(eventId, event, accessToken, refreshToken) {
  return new Promise((resolve, reject) => {
    const url = new URL(
      `${GOOGLE_CALENDAR_API}${eventId}`
    );
    const params = { conferenceDataVersion: 1 };
    Object.keys(params).forEach((key) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      url.searchParams.append(key, params[key])
    );

    const headers: AxiosRequestConfig["headers"] = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    };

    axios.put(url.toString(),
      event, { headers }
    ).then((res) => {
      return resolve(res.data)
    }).catch((err) => {
      console.log(err, "Put GoogleEvnets function error!!!")
      if (err.response.status === 401) {
        return refreshAccessToken(refreshToken).then((newAccessToken) => {
          return putEventIntoGoogleCalendar(eventId, event, newAccessToken, refreshToken);
        }).then(resolve).catch(reject)
      } else {
        return reject(err)
      }
    });
  })
}

function updateGoogleCalendarMeeting(meeting: Meeting, accessToken, refreshToken) {
  let attendees = [];

  meeting.members.map((member) => {
    attendees.push({
      name: member.name,
      email: member.email,
      responseStatus: "accepted",
      self: true,
    })
  })

  const timestamp = Date.now().toString();
  const requestId = "conference-" + timestamp;

  let summary = '';
  let description = '';

  if (meeting.summary.split(' - ').length > 1) {
    summary = meeting.summary.split(' - ')[0];
    description = meeting.summary.split(' - ')[1];
  } else {
    summary = meeting.summary
  }

  const event = {
    summary: summary,
    description: description ?? "",
    start: {
      dateTime: moment(meeting.date).format(),
      timeZone: moment().format('Z')
    },
    end: {
      dateTime: getDateAddedByMinutes(meeting.date, meeting.period).format(),
      timeZone: moment().format('Z')
    },
    ...(attendees?.length && { attendees: attendees }),
    conferenceData: {
      createRequest: {
        requestId: requestId,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    extendedProperties: {
      private: {
        meetingId: meeting._id,
        projectId: meeting.projectId,
      }
    }
  };
  putEventIntoGoogleCalendar(meeting.googleEventId, event, accessToken, refreshToken).catch(error => {
    signOut();
  })
}

export { fetchGoogleEvents, putEventIntoGoogleCalendar, updateGoogleCalendarMeeting };