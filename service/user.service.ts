import api from '../api/api';
import IUser from '../models/user.model';



export const updateUser = async (id: string, user: IUser) => {
    const resp = await api.patch(`/users/${id}`, user);
    const updatedUser = resp.data;
    return updatedUser;
}

export const getUser = async (id: string) => {
    const resp = await api.get(`/users/${id}`);
    const user = resp.data;
    return user;

}

export const signInUser = async (user: IUser) => {
    const resp = await api.post('/users/signIn', user);
    const signedInUser = resp.data;
    return signedInUser;
}

export const createUser = async (user: IUser) => {
    const resp = await api.post('/users', user);
    const newUser = resp.data;
    return newUser;

}

export const getUsers = async () => {
    const resp = await api.get('/users');
    const users = resp.data;
    return users;
}