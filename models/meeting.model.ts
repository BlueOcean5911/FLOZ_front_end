interface Meeting {
    _id?: string;
    date: Date;
    summary: string;
    projectId: string;
    updatedAt: Date;
    createdAt: Date;
}

export default Meeting;

interface IPerson{
    _id?: string;
    role: string; // what`s type of role?
    email: string;
    projectId: string;
    updatedAt: Date;
    createdAt: Date;
}