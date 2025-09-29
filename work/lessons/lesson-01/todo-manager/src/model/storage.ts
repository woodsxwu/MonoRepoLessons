import { promises as fs } from 'fs';
import path from 'path';
import { TodoList, Todo } from './todoList';

const STORAGE_FILE = path.join(process.cwd(), 'todos.json');

export async function saveTodos(todoList: TodoList): Promise<void> {
    try {
        const todos = todoList.getAll();
        const serializedTodos = todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
            createdAt: todo.createdAt.toISOString()
        }));
        
        const data = JSON.stringify(serializedTodos, null, 2);
        await fs.writeFile(STORAGE_FILE, data);
    } catch (error) {
        console.error('Error saving todos:', error);
        throw error;
    }
}

export async function loadTodos(): Promise<TodoList | null> {
    try {
        const data = await fs.readFile(STORAGE_FILE, 'utf-8');
        const todoData = JSON.parse(data);
        
        const todoList = new TodoList();
        
        if (Array.isArray(todoData)) {
            todoData.forEach((item: any) => {
                const todo = new Todo(item.id, item.title);
                if (item.completed) {
                    todo.toggleCompletion();
                }
                // Restore creation date
                (todo as any)._createdAt = new Date(item.createdAt);
                todoList.add(todo);
            });
        }
        
        return todoList;
    } catch (error) {
        if ((error as any).code === 'ENOENT') {
            // File doesn't exist, return empty todo list
            return new TodoList();
        }
        console.error('Error loading todos:', error);
        return null;
    }
}