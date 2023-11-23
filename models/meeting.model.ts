interface Meeting {
    _id?: string;
    date?: Date;
    audioURL?: string;
    summary?: string;
    members?: Array<string>;
    projectId?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export type {Meeting}
