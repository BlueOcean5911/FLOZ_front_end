interface IDocument {
    s3Key: string,
    s3Bucket: string,
    fileName:string,
    url:string,
    path: string;
    type: string;
    projectId: string;
    meetingId: string;
    lastAccessed: Date;
    updatedAt: Date;
    createdAt: Date;
}

export type  { IDocument };
