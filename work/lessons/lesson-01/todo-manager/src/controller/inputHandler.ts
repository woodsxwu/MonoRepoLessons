// src/controller/inputHandler.ts

import { KeyboardEvent } from 'blessed';
import { TodoList } from '../model/todoList';
import { actions } from './actions';

export class InputHandler {
    private todoList: TodoList;

    constructor(todoList: TodoList) {
        this.todoList = todoList;
    }

    public handleInput(event: KeyboardEvent): void {
        switch (event.key) {
            case 'enter':
                actions.createTodo(this.todoList);
                break;
            case 'backspace':
                actions.deleteTodo(this.todoList);
                break;
            case 'up':
                actions.navigateUp(this.todoList);
                break;
            case 'down':
                actions.navigateDown(this.todoList);
                break;
            default:
                break;
        }
    }
}