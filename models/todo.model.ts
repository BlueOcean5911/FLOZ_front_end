import Meeting from "./meeting.model";

interface Todo {
    _id?: string;
    description: string;
    dueDate: number;
    status: string;
    meetingId: string | Meeting;
    updatedAt: Date;
    createdAt: Date;
}

export default Todo;