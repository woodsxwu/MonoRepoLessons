import * as blessed from 'blessed';
import { ITodo } from '../model/todo';

export class ListPanel {
    private screen: blessed.Widgets.Screen;
    private list: blessed.Widgets.ListTable;
    private todos: ITodo[];

    constructor(screen: blessed.Widgets.Screen) {
        this.screen = screen;
        this.todos = [];
        this.list = blessed.listtable({
            parent: this.screen,
            keys: true,
            vi: true,
            border: 'line',
            style: {
                header: {
                    fg: 'white',
                    bg: 'blue',
                },
                cell: {
                    fg: 'white',
                    bg: 'black',
                },
            },
        });
    }

    public setTodos(todos: ITodo[]): void {
        this.todos = todos;
        this.render();
    }

    private render(): void {
        const data = this.todos.map(todo => [todo.id.toString(), todo.title, todo.completed ? '✓' : '✗']);
        this.list.setData({
            headers: ['ID', 'Title', 'Completed'],
            data: data,
        });
        this.screen.render();
    }

    public updateTodoDisplay(todo: ITodo): void {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
            this.todos[index] = todo;
            this.render();
        }
    }
}