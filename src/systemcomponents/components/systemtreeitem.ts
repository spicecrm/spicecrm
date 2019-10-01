/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from "@angular/core";

@Component({
    selector: "system-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemtreeitem.html"
})

export class SystemTreeItem implements AfterViewInit, OnDestroy {
    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public itemPosition$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public dropListId$: EventEmitter<any> = new EventEmitter<any>();
    @Input() public selectedItem: string = "";
    @Input() public items: any = [];
    @Input() private dropListIds: any = [];
    @Input() private config: any = {};
    @Input() private hasChildren: boolean = false;
    @ViewChild('dropList', {static: false} ) private dropList;

    get connectionList() {
        return (this.dropList && this.hasChildren) ? this.dropListIds.filter(i => i != this.dropList.id) : this.dropListIds;
    }

    public ngAfterViewInit() {
        if (this.hasChildren && this.dropList && this.config.draggable) {
            window.setTimeout(() => this.dropListId$.emit({id: this.dropList.id, action: 'add'}), 100);
        }
    }

    public ngOnDestroy() {
        if (this.dropList && this.config.draggable) {
            window.setTimeout(() => this.dropListId$.emit({id: this.dropList.id, action: 'remove'}), 100);
        }
    }

    public expand(item, e?) {
        item.expanded = !item.expanded;
        e.stopPropagation();
    }

    public addItem(e, parentId, parentName) {
        this.addItem$.emit({id: parentId, name: parentName});
        e.stopPropagation();
    }

    private selectItem(e, id) {
        this.selectedItem$.emit(id);
        e.stopPropagation();
    }

    private trackByFn(i, item) {
        return item.id;
    }
}
