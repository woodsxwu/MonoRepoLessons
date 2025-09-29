// src/controller/actions.ts

import { TodoList } from '../model/todoList';
import { ITodo } from '../model/todo';

export function createTodo(todoList: TodoList, title: string): ITodo | null {
    if (!title.trim()) {
        console.error('Todo title cannot be empty.');
        return null;
    }
    const newTodo: ITodo = {
        id: Date.now(),
        title: title.trim(),
        completed: false,
        createdAt: new Date(),
    };
    todoList.add(newTodo);
    return newTodo;
}

export function updateTodo(todoList: TodoList, id: number, updates: Partial<ITodo>): boolean {
    const todo = todoList.getById(id);
    if (!todo) {
        console.error(`Todo with id ${id} not found.`);
        return false;
    }
    if (updates.title && !updates.title.trim()) {
        console.error('Todo title cannot be empty.');
        return false;
    }
    todoList.update(id, updates);
    return true;
}

export function deleteTodo(todoList: TodoList, id: number): boolean {
    const success = todoList.remove(id);
    if (!success) {
        console.error(`Todo with id ${id} not found.`);
    }
    return success;
}