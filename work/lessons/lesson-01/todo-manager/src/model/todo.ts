export interface ITodo {
    id: number;  // Changed from string to number
    title: string;
    completed: boolean;
    createdAt: Date;
}

export class Todo implements ITodo {
    private _id: number;  // Changed from string to number
    private _title: string;
    private _completed: boolean;
    private _createdAt: Date;

    constructor(id: number, title: string) {  // Changed parameter type
        this._id = id;
        this._title = this.validateTitle(title);
        this._completed = false;
        this._createdAt = new Date();
    }

    private validateTitle(title: string): string {
        if (!title || title.trim().length === 0) {
            throw new Error("Title cannot be empty.");
        }
        return title.trim();
    }

    public validate(): void {
        this.validateTitle(this._title);
    }

    get id(): number {  // Changed return type
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get completed(): boolean {
        return this._completed;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    public toggleCompletion(): void {
        this._completed = !this._completed;
    }

    public updateTitle(newTitle: string): void {
        this._title = this.validateTitle(newTitle);
    }

    // Add setter for completed (needed for CLI)
    set completed(value: boolean) {
        this._completed = value;
    }

    set title(value: string) {
        this._title = this.validateTitle(value);
    }
}