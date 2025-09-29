import { Todo } from './todo';

export { Todo } from './todo';

class TodoList {
    private todos: Todo[];

    constructor() {
        this.todos = [];
    }

    add(todo: Todo): void {
        this.todos.push(todo);
    }

    remove(id: number): boolean {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter(todo => todo.id !== id);
        return this.todos.length < initialLength;
    }

    update(id: number, title: string, completed: boolean): boolean {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.updateTitle(title);
            if (completed !== todo.completed) {
                todo.toggleCompletion();
            }
            return true;
        }
        return false;
    }

    getAll(): Todo[] {
        return [...this.todos]; // Return a copy
    }

    getById(id: number): Todo | undefined {
        return this.todos.find(todo => todo.id === id);
    }

    // Add methods for statistics
    getCompletedCount(): number {
        return this.todos.filter(todo => todo.completed).length;
    }

    getPendingCount(): number {
        return this.todos.filter(todo => !todo.completed).length;
    }

    search(query: string): Todo[] {
        const lowercaseQuery = query.toLowerCase();
        return this.todos.filter(todo => 
            todo.title.toLowerCase().includes(lowercaseQuery)
        );
    }
}

export { TodoList };