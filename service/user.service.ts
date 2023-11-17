import api from '../api/api';
import { IUser } from '../models';
import { IResponse } from '@types';



export const updateUser = async (id: string, user: IUser) => {
    const resp: IResponse = await api.patch(`/users/${id}`, user);
    const updatedUser: IUser = resp?.data && resp.data.data as IUser;
    return updatedUser;
}

export const getUser = async (id: string) => {
    const resp: IResponse = await api.get(`/users/${id}`);
    const user: IUser = resp?.data && resp.data.data as IUser;
    return user;

}

export const signInUser = async (user: IUser) => {
    const resp: IResponse = await api.post('/users/signIn', user);
    const signedInUser: IUser = resp?.data && resp.data.data as IUser;
    return signedInUser;
}

export const createUser = async (user: IUser) => {
    const resp: IResponse = await api.post('/users', user);
    const newUser: IUser = resp?.data && resp.data.data as IUser;
    return newUser;

}

export const getUsers = async () => {
    const resp: IResponse = await api.get('/users');
    const users: IUser[] = resp?.data && resp.data.data as IUser[];
    return users;
}