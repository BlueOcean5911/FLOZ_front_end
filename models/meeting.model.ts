interface Meeting {
    _id?: string;
    date?: Date;
    audioURL?: string;
    summary?: string;
    members?: Array<any>;
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
