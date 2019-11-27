/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: "system-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemtreeitem.html"
})

export class SystemTreeItem {
    @Output() public onItemAdd: EventEmitter<any> = new EventEmitter<any>();
    @Output() public toggleExpandedChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() public dragPositionChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() public item: any = [];
    @Input() private config: any = {};
    @Input() private isDragging: boolean = false;
    private dragPosition: string = '';

    public addItem(parentId, parentName) {
        this.onItemAdd.emit({id: parentId, name: parentName});
    }

    public expand(item, e?) {
        this.toggleExpandedChange.emit(item.id);
        if (e && e.stopPropagation) e.stopPropagation();
    }

    private setPosition(position) {
        if (!this.isDragging) return;
        this.dragPosition = position;
        this.dragPositionChange.emit(!position ? null : {id: this.item.id, position});
    }
}
