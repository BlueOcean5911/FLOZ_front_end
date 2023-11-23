import { Meeting } from "./meeting.model";

interface Todo {
    _id?: string;
    description: string;
    dueDate: Date;
    status: string;
    meetingId: string | Meeting;
    updatedAt: Date;
    createdAt: Date;
}

export default Todo;