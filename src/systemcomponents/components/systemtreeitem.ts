/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output, TemplateRef} from "@angular/core";
import {SystemTreeItemI} from "../interfaces/systemcomponents.interfaces";

@Component({
    selector: "system-tree-item",
    templateUrl: "../templates/systemtreeitem.html"
})

export class SystemTreeItem {

    @Input() public customButtonsContainer: TemplateRef<any>;
    /*
    * @output onItemAdd: object
    * {
    *   id: string = parentId,
    *   name: string = parentName
    * }
    */
    @Output() public onItemAdd: EventEmitter<any> = new EventEmitter<any>();
    /*
    * @output toggleExpandedChange: string = item.id
    */
    @Output() public toggleExpandedChange: EventEmitter<any> = new EventEmitter<any>();
    /*
    * @output dragPositionChange: object:
    * {
    *   id: string = item.id,
    *   position: string
    * }
    */
    @Output() public dragPositionChange: EventEmitter<any> = new EventEmitter<any>();
    /**
     * tree item object
     */
    @Input() public item: SystemTreeItemI;
    /*
    * @input config: object
    */
    @Input() public config: any = {};
    /*
    * @input isDragging: boolean
    */
    @Input() public isDragging: boolean = false;
    public dragPosition: string = '';

    /*
    * @param parentId: string
    * @param parentName: string
    * @emit object by @Output onItemAdd
    */
    public addItem(parentId, parentName) {
        this.onItemAdd.emit({id: parentId, name: parentName});
    }

    /*
    * @param item: object
    * @param e?: MouseEvent
    * @stop MouseEvent propagation
    * @emit object: {id: string = parentId, name: string = parentName} by @output onItemAdd
    */
    public expand(item, e?) {
        this.toggleExpandedChange.emit(item.id);
        if (e && e.stopPropagation) e.stopPropagation();
    }

    /*
    * @param position: string
    * @set dragPosition
    * @emit null | object by @output dragPositionChange
    */
    public setPosition(position) {
        this.dragPosition = position;
        if (!this.isDragging) return;
        this.dragPositionChange.emit(!position ? null : {id: this.item.id, position});
    }
}
