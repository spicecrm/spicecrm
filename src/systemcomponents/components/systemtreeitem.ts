import {Component, Input, Output, EventEmitter, OnChanges} from "@angular/core";


@Component({
    selector: "system-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemtreeitem.html"
})
export class SystemTreeItem {
    @Input() public items: any = [];
    @Input() public selectedId: string = "";
    @Output() public selectedItem = new EventEmitter<any>();


    private expand(item) {
        if (item.expanded) {
            item.expanded = false;
        } else {
            item.expanded = true;
        }
    }

    private choose(item) {
        this.selectedItem.emit(item);
    }

}
