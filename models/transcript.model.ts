interface ITranscript {
    _id?: string;
    transcript: string;
    transcriptSummary: string;
    todos: Object;
    meetingId: string;
    documentId: string;
    updatedAt: Date;
    createdAt: Date;
    audioFileUrl?: string;
}

export type { ITranscript };