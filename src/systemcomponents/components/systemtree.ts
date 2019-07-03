/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

/**
 * @ignore
 */
declare var _: any;

/* -----------------------------------
*  -- REQUIRED INPUT LIST STRUCTURE --
* ------------------------------------
* - id: string
* - parent_id: string
* - parent_sequence: string
* - name: string
* - selected: boolean
* - clickable: boolean
* -------------------
* -- @INPUT PARAMS --
* -------------------
* - treelist: any[] = [];
* - selectedItem: string = "";
* - config: any = {
*       draggable: false,
*       canadd: false,
*       clickable: false,
*       expandall: false,
*       collapsible: true
*   };
*---------------------
* -- @OUTPUT PARAMS --
* --------------------
* - selectedItem$: string = selected item id;
* - addItem$: string = parent item id
* - itemPosition$: any = {
*       id: string = moved item id,
*       parent_id: string = parent item id,
*       parent_name: string = parent item name,
*       parent_sequence: string = item new sequence
*   };
* ----------------------------
* TODO:Lazy Load functionality
*/

@Component({
    selector: "system-tree",
    templateUrl: "./src/systemcomponents/templates/systemtree.html"
})

export class SystemTree implements OnChanges {
    @Input() public treelist: any[] = [];
    @Input() public selectedItem: string = "";

    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public itemPosition$: EventEmitter<any> = new EventEmitter<any>();

    public tree: any[] = [];
    public droplistids: any[] = [];
    private treeConfig: any = {
        draggable: false,
        canadd: false,
        clickable: false,
        expandall: false,
        collapsible: true,
    };

    get config() {
        return this.treeConfig;
    }

    @Input()
    set config(obj) {
        this.treeConfig.draggable = obj.draggable || false;
        this.treeConfig.canadd = obj.canadd || false;
        this.treeConfig.clickable = obj.clickable || false;
        this.treeConfig.expandall = obj.expandall || false;
        this.treeConfig.collapsible = obj.collapsible || true;
    }

    get dropListIds() {
        return this.droplistids;
    }

    set dropListIds(val) {
        this.droplistids = val;
    }

    public ngOnChanges() {
        this.resetTreeList();
        this.tree = this.buildTree(this.treelist);
    }

    private resetTreeList() {
        this.treelist.map(item => {
            if (item.parent_id === "" || item.parent_id === undefined) {
                item.parent_id = null;
            }
            item.parent_name = "";
            item = _.omit(item, "path", "level", "children");
            return item;
        });
    }

    private buildTree(treelist, parent = null, level = 0, parentpath = []) {
        let tree = [];
        for (let item of treelist) {
            if (item.parent_id === parent) {

                item.expanded = this.config.collapsible ? this.config.expandall : true;
                item.clickable = this.config.clickable;
                item.level = level + 1;
                item.path = parentpath.slice();
                item.path[level] = item.id;

                let children = this.buildTree(treelist, item.id, level + 1, item.path);
                delete item.path[level + 1];

                item.children = children.length ? children : [];

                // set expanded if child is selected or also expanded
                for (let child of children) {
                    if (child.id === this.selectedItem || child.expanded) {
                        item.expanded = true;
                    }
                }
                tree.push(item);
            }
        }
        return tree;
    }

    private handleDrop(dragEvent: CdkDragDrop<any>) {
        let newParent: any = dragEvent.container.data[0];
        let newItemPosition = {
            id: dragEvent.item.data.id,
            parent_id: newParent.parent_id,
            parent_sequence: dragEvent.currentIndex
        };
        let canDrop = !this.treelist
            .some(item => item.id === newItemPosition.parent_id && item.path.includes(newItemPosition.id));

        if (dragEvent.previousContainer === dragEvent.container) {
            moveItemInArray(dragEvent.container.data, dragEvent.previousIndex, dragEvent.currentIndex);
            this.itemPosition$.emit(newItemPosition);
        } else if (canDrop) {
            dragEvent.item.data.level = newParent.level;
            transferArrayItem(dragEvent.previousContainer.data,
                dragEvent.container.data,
                dragEvent.previousIndex,
                dragEvent.currentIndex);
            this.itemPosition$.emit(newItemPosition);
        }
    }

    private handleDropListId(obj) {
        if (obj.action == 'add') {
            this.droplistids.push(obj.id);
        } else {
            this.droplistids = this.droplistids.filter(id => id != obj.id);
        }
    }
}
