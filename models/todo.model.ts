import { Meeting } from "./meeting.model";
import { IProject } from "./project.model";

interface Todo {
    _id?: string;
    title?: string;
    description: string;
    dueDate?: Date;
    status: string;
    meetingId: string | Meeting;
    projectId: string | IProject;
    updatedAt?: Date;
    createdAt?: Date;
}

export default Todo;