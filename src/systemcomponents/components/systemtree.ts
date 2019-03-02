/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output, SimpleChanges} from "@angular/core";

/**
* @ignore
*/
declare var _: any;
/*
* -- @INPUT PARAMS --
* - treelist: any[] = [];
* - selectedItem: string = "";
* - config: any =
*   {
*       draggable: false,
*       canadd: false,
*       clickable: false,
*       expandall: false,
*       collapsible: true
*   };
*
* -- @OUTPUT PARAMS --
* - selectedItem$: string = selected item id;
* - addItem$: string = parent item id
* - treelistChange$: any =
*   {
*       id: string = moved item id,
*       parent_id: string = parent item id,
*       parent_name: string = parent item name,
*   };
* TODO:Lazy Load functionality
*/

@Component({
    selector: "system-tree",
    templateUrl: "./src/systemcomponents/templates/systemtree.html"
})

export class SystemTree {
    @Output() public selectedItem$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public treelistChange$: EventEmitter<any> = new EventEmitter<any>();
    @Output() public addItem$: EventEmitter<any> = new EventEmitter<any>();
    @Input() public treelist: any[] = [];
    @Input() public selectedItem: string = "";
    public tree: Array<any> = [];
    private treeConfig: any = {
        draggable: false,
        canadd: false,
        clickable: false,
        expandall: false,
        collapsible: true,
    };
    @Input() set config(obj) {
        this.treeConfig.draggable = obj.draggable || false;
        this.treeConfig.canadd = obj.canadd || false;
        this.treeConfig.clickable = obj.clickable || false;
        this.treeConfig.expandall = obj.expandall || false;
        this.treeConfig.collapsible = obj.collapsible || true;
    }

    get config() {
        return this.treeConfig;
    }

    //  -- INPUT LIST STRUCTURE --
    // id
    // parent_id
    // name
    // selected
    // clickable

    private ngOnChanges(changes: SimpleChanges) {
        this.resetTreelist();
        this.tree = this.buildTree(this.treelist);
    }

    private resetTreelist() {
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

                if (children.length) {
                    item.children = children;
                } else {
                    item.children = [];
                }

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

    private handleSelectItemEvent(id) {
        this.selectedItem$.emit(id);
    }

    private handleAddEvent(parent) {
        this.addItem$.emit(parent);
    }

    /*
    * Emit: moved Item with fields:
    * id, parent_id, parent_name
    */
    private handleDragDropEvent(obj: any) {
        let toEdit: any = {};
        let canDrop = true;
        for (let item of this.treelist) {
            if (item.id === obj.child && item.level === 1) {
                canDrop = false;
            }
            if (item.id === obj.parent && item.path.includes(obj.child)) {
                canDrop = false;
            }
        }
        if (canDrop) {
            toEdit.id = obj.child;
            toEdit.parent_id = obj.parent;
            toEdit.parent_name = this.treelist.find(unit => unit.id === obj.parent).name;
            this.treelistChange$.emit(toEdit);
        }
    }
}
