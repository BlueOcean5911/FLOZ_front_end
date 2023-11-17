import api from '../api/api';
import { IProject } from '../models';



export const updateProject = async (id: string, body: IProject) => {
    const resp = await api.patch(`/projects/${id}`, body);
    const updated = resp.data;
    return updated;
}

export const getProject = async (id: string) => {
    const resp = await api.get(`/projects/${id}`);
    const data = resp.data;
    return data;

}

export const createProject = async (body: IProject) => {
    const resp = await api.post('/projects', body);
    const data = resp.data;
    return data;

}

export const getProjects = async (query) => {
    const queryParams = new URLSearchParams(query).toString();
    console.log("query paramsn",queryParams);
    const resp = await api.get(`/projects?${queryParams}`);
    const data = resp.data;
    return data;
}