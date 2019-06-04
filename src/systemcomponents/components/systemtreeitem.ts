/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output, Renderer2} from "@angular/core";

@Component({
    selector: "system-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemtreeitem.html"
})

export class SystemTreeItem {

    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public treelistChange$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Input() public selectedItem: string = "";
    @Input() public items: any = [];
    @Input() private config: any = {};

    constructor(private renderer: Renderer2) {
    }

    public expand(item, e?) {
        if (!item) {
            return;
        }
        item.expanded = !item.expanded;
        e.stopPropagation();

    }

    public addItem(e, parentId, parentName) {
        this.handleAddEvent({id: parentId, name: parentName});
        e.stopPropagation();
    }

    public handleAddEvent(parent) {
        this.addItem$.emit(parent);
    }

    private selectItem(e, id) {
        this.selectedItem$.emit(id);
        e.stopPropagation();
    }

    private handleSelectItemEvent(id) {
        this.selectedItem$.emit(id);
    }

    private dragItem(e, id) {
        if (!this.config.draggable) {
            return;
        }
        e.dataTransfer.setDragImage(this.renderer.createElement("div"), 0, 0);
        e.dataTransfer.setData("itemId", id);
        e.stopPropagation();
    }

    private onDragging(e) {
        if (!this.config.draggable) {
            return;
        }
        if (e.currentTarget.firstChild.tagName == 'ARTICLE') {
            this.renderer.setStyle(e.currentTarget.firstChild, "border", "1px solid red");
        }
        e.preventDefault();
        e.stopPropagation();
    }

    private onDragLeave(e) {
        if (!this.config.draggable) {
            return;
        }
        if (e.currentTarget.firstChild.tagName == 'ARTICLE') {
            this.renderer.removeStyle(e.currentTarget.firstChild, "border");
        }
    }

    // Pass to emitter: Ids of moved and targeted item
    private dropItem(e, dropitemId) {
        if (!this.config.draggable) {
            return;
        }
        if (e.currentTarget.firstChild.tagName == 'ARTICLE') {
            this.renderer.removeStyle(e.currentTarget.firstChild, "border");
        }
        let itemId: string = e.dataTransfer.getData("itemId");
        if (itemId && itemId !== dropitemId) {
            this.handleDragDropEvent({child: itemId, parent: dropitemId});
        }

        e.dataTransfer.clearData();
        e.preventDefault();
        e.stopPropagation();
    }

    private handleDragDropEvent(obj: any) {
        this.treelistChange$.emit(obj);
    }
}
