interface IProject {
    _id?: string;
    name?: string;
    status?: boolean;
    color?: string;
    phase: string;
    dueDate: Date;
    userId?: string;
    updatedAt?: Date;
    createdAt?: Date;
}

export type  { IProject };
