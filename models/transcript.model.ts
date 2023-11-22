interface ITranscript {
    _id?: string;
    transcript: string;
    transcriptSummary: string;
    todos: Object;
    meetingId: string;
    documentId: string;
    updatedAt: Date;
    createdAt: Date;
}

export type { ITranscript };