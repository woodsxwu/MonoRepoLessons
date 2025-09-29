import * as blessed from 'blessed';

export class StatusBar {
    private screen: blessed.Widgets.Screen;
    private statusBar: blessed.Widgets.BoxElement;

    constructor(screen: blessed.Widgets.Screen) {
        this.screen = screen;
        this.statusBar = blessed.box({
            bottom: 0,
            height: 1,
            width: '100%',
            content: 'Status: Ready | Todos: 0',
            style: {
                bg: 'black',
                fg: 'white',
                border: {
                    type: 'line',
                    fg: 'white'
                }
            }
        });

        this.screen.append(this.statusBar);
    }

    public updateStatus(message: string, todoCount: number): void {
        this.statusBar.setContent(`Status: ${message} | Todos: ${todoCount}`);
        this.screen.render();
    }
}