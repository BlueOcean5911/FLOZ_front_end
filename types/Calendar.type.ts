
interface Item {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  attendees: [
    {
      email: string;
      responseStatus: string;
      self: boolean;
    }
  ];
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
    signature: string;
  };
  hangoutLink: string;
  extendedProperties?: {
    private?: {
      projectId?: string;
      meetingId?: string;
    }
  }
}
interface Event {
  kind: string;
  summary: string;
  items: Item[];
}

export type {Item, Event}