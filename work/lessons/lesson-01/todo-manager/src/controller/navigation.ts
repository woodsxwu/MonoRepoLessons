// src/controller/navigation.ts
import { ListPanel } from '../view/listPanel';
import { DetailPanel } from '../view/detailPanel';

export class Navigation {
    private currentFocus: 'list' | 'detail';

    constructor(private listPanel: ListPanel, private detailPanel: DetailPanel) {
        this.currentFocus = 'list'; // Start with the list panel focused
    }

    public moveToList() {
        this.currentFocus = 'list';
        this.listPanel.focus();
        this.detailPanel.blur();
    }

    public moveToDetail() {
        this.currentFocus = 'detail';
        this.detailPanel.focus();
        this.listPanel.blur();
    }

    public getCurrentFocus() {
        return this.currentFocus;
    }
}