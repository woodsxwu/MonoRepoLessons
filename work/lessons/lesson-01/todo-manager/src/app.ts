// src/app.ts
import blessed from 'blessed';
import { TodoList } from './model/todoList';
import { Layout } from './view/layout';
import { InputHandler } from './controller/inputHandler';

class App {
    private todoList: TodoList;
    private layout: Layout;
    private inputHandler: InputHandler;

    constructor() {
        this.todoList = new TodoList();
        this.layout = new Layout();
        this.inputHandler = new InputHandler(this.layout, this.todoList);
    }

    public start() {
        this.layout.render();
        this.inputHandler.setup();
        this.layout.screen.render();
    }
}

const app = new App();
app.start();