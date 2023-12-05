import axios from "axios";
import refreshAccessToken from "./refreshGoogleOAuthToken";

function fetchGoogleEvents(accessToken, refreshToken) {
  return new Promise((resolve, reject) => {
    axios.get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
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

export { fetchGoogleEvents };