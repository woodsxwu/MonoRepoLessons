import blessed from 'blessed';

class Layout {
    private screen: blessed.Widgets.Screen;

    constructor() {
        this.screen = blessed.screen({
            smartCSR: true,
            title: 'Todo Manager',
        });

        this.screen.key(['escape', 'q', 'C-c'], () => {
            return process.exit(0);
        });
    }

    public render() {
        this.screen.render();
    }

    public getScreen() {
        return this.screen;
    }
}

export default Layout;