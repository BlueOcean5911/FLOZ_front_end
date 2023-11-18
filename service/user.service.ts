import api from '../api/api';
import User from '../models/user.model';

export const updateUser = async (id: string, user: User) => {
    const resp = await api.patch(`/users/${id}`, user);
    const updatedUser = resp.data;
    return updatedUser;
}

export const getUser = async (id: string) => {
    const resp = await api.get(`/users/${id}`);
    const user = resp.data;
    return user;

}

export const getUserByEmail = async (email: string): Promise<User[] | []> => {
    const resp = await api.get(`/users?email=${email}`);
    const user = resp.data?.data || [];
    return user;

}

export const createUser = async (user: User): Promise<User> => {
    const resp = await api.post('/users', user);
    const newUser = resp.data?.data as User;
    return newUser;
}

export const getUsers = async () => {
    const resp = await api.get('/users');
    const users = resp.data;
    return users;
}