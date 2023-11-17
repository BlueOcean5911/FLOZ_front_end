import api from '../api/api';
import Todo from '../models/todo.model';

export const updateTodo = async (id: string, todo: Todo) => {
    const resp = await api.patch(`/todos/${id}`, todo);
    const updatedTodo = resp.data?.data;
    return updatedTodo;
}

export const getTodo = async (id: string) => {
    const resp = await api.get(`/todos/${id}`);
    const todo = resp.data?.data;
    return todo;

}

export const createTodo = async (todo: Todo) => {
    const resp = await api.post('/todos', todo);
    const newTodo = resp.data?.data;
    return newTodo;

}

export const getTodos = async (): Promise<Todo[]> => {
    const resp = await api.get('/todos');
    const todos = resp.data?.data || [];
    return todos;
}