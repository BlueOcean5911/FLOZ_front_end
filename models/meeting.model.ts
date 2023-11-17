interface Meeting {
    _id?: string;
    date: Date;
    summary: string;
    projectId: string;
    updatedAt: Date;
    createdAt: Date;
}

export default Meeting;