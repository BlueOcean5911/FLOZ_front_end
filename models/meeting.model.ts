interface Meeting {
    _id?: string;
    date: Date;
    audioURL: string;
    summary: string;
    projectId: string;
    updatedAt: Date;
    createdAt: Date;
}

export type {Meeting}
