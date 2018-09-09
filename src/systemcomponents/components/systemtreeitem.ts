import {Component, Input, Output, EventEmitter} from '@angular/core';


@Component({
    selector: 'system-tree-item',
    templateUrl: './app/systemcomponents/templates/systemtreeitem.html'
})
export class SystemTreeItem {


    @Input() items: any = [];
    @Output() selectedItem = new EventEmitter<any>();

    expand(item) {
        if (item.expanded) {
            item.expanded = false;
        } else {
            item.expanded = true;
        }
    }

    choose(item) {
        this.selectedItem.emit(item);
    }
}