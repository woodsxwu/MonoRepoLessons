import * as blessed from 'blessed';

export class DetailPanel {
    private screen: blessed.Widgets.Screen;
    private box: blessed.Widgets.BoxElement;
    private title: blessed.Widgets.TextElement;
    private completed: blessed.Widgets.TextElement;
    private createdAt: blessed.Widgets.TextElement;

    constructor(screen: blessed.Widgets.Screen) {
        this.screen = screen;
        this.box = blessed.box({
            top: 'center',
            left: 'center',
            width: '50%',
            height: '50%',
            border: 'line',
            style: {
                border: {
                    fg: 'cyan'
                }
            }
        });

        this.title = blessed.text({
            top: 1,
            left: 1,
            content: 'Title: ',
            style: {
                fg: 'white'
            }
        });

        this.completed = blessed.text({
            top: 3,
            left: 1,
            content: 'Completed: ',
            style: {
                fg: 'white'
            }
        });

        this.createdAt = blessed.text({
            top: 5,
            left: 1,
            content: 'Created At: ',
            style: {
                fg: 'white'
            }
        });

        this.box.append(this.title);
        this.box.append(this.completed);
        this.box.append(this.createdAt);
        this.screen.append(this.box);
    }

    public render(todo: { title: string; completed: boolean; createdAt: Date }): void {
        this.title.setContent(`Title: ${todo.title}`);
        this.completed.setContent(`Completed: ${todo.completed ? 'Yes' : 'No'}`);
        this.createdAt.setContent(`Created At: ${todo.createdAt.toLocaleString()}`);
        this.screen.render();
    }

    public clear(): void {
        this.title.setContent('Title: ');
        this.completed.setContent('Completed: ');
        this.createdAt.setContent('Created At: ');
        this.screen.render();
    }
}