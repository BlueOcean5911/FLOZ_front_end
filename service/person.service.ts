import api from '../api/api';
import { IPerson } from '../models';
import { IResponse } from '@types';



export const updatePerson = async (id: string, Person: IPerson) => {
    const resp: IResponse = await api.patch(`/persons/${id}`, Person);
    const updatedPerson: IPerson = resp?.data && resp.data.data as IPerson;
    return updatedPerson;
}

export const getPerson = async (id: string) => {
    const resp: IResponse = await api.get(`/persons/${id}`);
    const Person: IPerson = resp?.data && resp.data.data as IPerson;
    return Person;

}

export const createPerson = async (Person: IPerson): Promise<IPerson> => {
    const resp: IResponse = await api.post('/persons', Person);
    const newPerson: IPerson = resp?.data?.data as IPerson && resp.data.data as IPerson;
    return newPerson;
}

export const getPersons = async () => {
    const resp: IResponse = await api.get('/persons');
    const users: IPerson[] = resp?.data && resp.data.data as IPerson[];
    return users;
}