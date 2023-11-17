import api from '../api/api';
import { IProject } from '../models';
import { IResponse } from '@types';


export const updateProject = async (id: string, body: IProject) => {
    const resp: IResponse = await api.patch(`/projects/${id}`, body);
    const updated: IProject | null = resp?.data && resp.data.data as IProject;
    return updated;
}

export const getProject = async (id: string) => {
    const resp: IResponse = await api.get(`/projects/${id}`);
    const data : IProject | null = resp?.data && resp.data.data as IProject;
    return data;
}

export const createProject = async (body: IProject) => {
    const resp: IResponse = await api.post('/projects', body);
    const data: IProject | null = resp?.data && resp.data as IProject;
    return data;
}

export const getProjects = async (query: any) => {
    const queryParams = new URLSearchParams(query).toString();
    const resp: IResponse = await api.get(`/projects?${queryParams}`);
    const data: IProject[] = resp?.data && resp.data.data as IProject[];
    return data;
}

export const deleteProject = async (id: string) => {
    const resp: IResponse = await api.delete(`/projects/${id}`);
    return resp;
}