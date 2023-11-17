import api from '../api/api';
import Project from '../models/project.model';

export const updateProject = async (id: string, project: Project) => {
    const resp = await api.patch(`/projects/${id}`, project);
    const updatedProject = resp.data?.data;
    return updatedProject;
}

export const getProject = async (id: string) => {
    const resp = await api.get(`/projects/${id}`);
    const project = resp.data?.data;
    return project;

}

export const createProject = async (project: Project) => {
    const resp = await api.post('/projects', project);
    const newProject = resp.data?.data;
    return newProject;

}

export const getProjects = async () => {
    const resp = await api.get('/projects');
    const projects = resp.data?.data || [];
    return projects;
}