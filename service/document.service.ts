import api from '../api/api';
import { IDocument } from '../models';
import { IResponse } from '@types';


export const updateDocument = async (id: string, body: IDocument) => {
    const resp: IResponse = await api.patch(`/documents/${id}`, body);
    const updated: IDocument | null = resp?.data && resp.data.data as IDocument;
    return updated;
}

export const getDocument = async (id: string) => {
    const resp: IResponse = await api.get(`/documents/${id}`);
    const data : IDocument | null = resp?.data && resp.data.data as IDocument;
    return data;
}

export const createDocument = async (body: IDocument) => {
    const resp: IResponse = await api.post('/documents', body);
    const data: IDocument | null = resp?.data && resp.data as any as IDocument;
    return data;
}

export const getAllDocument = async (projectId:string,query: any) => {
    const queryParams = new URLSearchParams(query).toString();
    const resp: IResponse = await api.get(`/documents/${projectId}/all`);
    const data: IDocument[] = resp?.data && resp.data.data as any[];
    return data;
}

export const deleteDocument = async (id: string) => {
    const resp: IResponse = await api.delete(`/documents/${id}`);
    return resp;
}