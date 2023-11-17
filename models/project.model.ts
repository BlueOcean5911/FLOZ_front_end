interface Project {
    _id?: string;
    name: string;
    status: boolean;
    userId: string;
    updatedAt: Date;
    createdAt: Date;
}

export default Project;