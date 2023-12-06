interface Meeting {
    _id?: string;
    date?: Date;
    audioURL?: string;
    summary?: string;
    members?: Array<any>;
    assignPeopleMap?:Object;
    favourite?:boolean;
    topic?:string;
    period?:number;
    googleMeetingUrl?:string;
    googleEventId?:string;
    projectId?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export type {Meeting}
