/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

/**
 * @ignore
 */
declare var _: any;

/* -----------------------------------
*  -- REQUIRED INPUT treelist STRUCTURE --
* ------------------------------------
* - id: string
* - parent_id: string
* - parent_sequence: string
* - name: string
* - clickable: boolean
* -------------------
* -- @INPUT PARAMS --
* -------------------
* - treelist: any[] = [];
* - selectedItem: string = "";
* - config: any = {
*       draggable: false,
*       canadd: false,
*       expandall: false,
*       collapsible: true
*   };
*---------------------
* -- @OUTPUT PARAMS --
* --------------------
* - selectedItemChange: string = selected item id;
* - onItemAdd: string = parent item id
* - onTreeDrop: any = {
*       itemWithNewParent?: {
*           id: string,
*           parent_id: string
*       },
*       newSortSequences?: {
*           id: string,
*           index: number
*       }
* }
*
* NOTE: selected item can be used as two way binding angular like:
*   <system-tree [(selectedItem)] ></system-tree>
*/

@Component({
    selector: "system-tree",
    templateUrl: "./src/systemcomponents/templates/systemtree.html",
    styles: ['.cdk-drag-animating {transition: none}']
})

export class SystemTree implements OnChanges {
    @Input('treelist') public sourceList: any[] = [];
    @Output() public selectedItemChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onItemAdd: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onTreeDrop: EventEmitter<any> = new EventEmitter<any>();
    public tree: any[] = [];
    @Input() private selectedItem: string = "";
    private dragPosition: any;
    private isDragging: boolean = false;
    private treeConfig: any = {
        draggable: false,
        canadd: false,
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
        this.treeConfig.expandall = obj.expandall || false;
        this.treeConfig.collapsible = obj.collapsible || true;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.sourceList) {
            this.sourceList.sort((a, b) => a.name && b.name ? a.name > b.name ? 1 : -1 : 0);
            this.buildTree();
        }
        if (changes.selectedItem) this.handleClick(this.selectedItem);
    }

    private buildTree() {
        this.tree = [];
        this.sortBySequence();
        this.addTreeItem();
        this.setHasChildren();
    }

    private sortBySequence() {
        let groupedByParent = _.groupBy(this.sourceList, item => item.parent_id);
        this.sourceList = [];
        for (let parentId in groupedByParent) {
            if (groupedByParent.hasOwnProperty(parentId)) {
                groupedByParent[parentId].sort((a, b) => a.parent_sequence && b.parent_sequence ? a.parent_sequence > b.parent_sequence ? 1 : -1 : 0);
                this.sourceList = [...this.sourceList, ...groupedByParent[parentId]];
            }
        }
    }

    private addTreeItem(parentId = '', level = 1) {
        for (let item of this.sourceList) {
            if (!item.parent_id && parentId == '' || item.parent_id == parentId) {
                if (!item.systemTreeDefs) {
                    item.systemTreeDefs = {};
                }
                item.systemTreeDefs.expanded = this.config.collapsible ? this.config.expandall ? true : !!item.systemTreeDefs.expanded : false;
                item.systemTreeDefs.clickable = item.hasOwnProperty('clickable') ? item.clickable : true;
                item.systemTreeDefs.level = level;
                item.systemTreeDefs.isSelected = this.selectedItem == item.id;
                this.tree.push(item);
                if (item.systemTreeDefs.expanded) {
                    this.addTreeItem(item.id, level + 1);
                }
            }
        }
    }

    private setHasChildren() {
        this.tree.forEach(item => {
            item.systemTreeDefs.hasChildren = this.sourceList.some(i => i.parent_id == item.id);
        });
    }

    /*
    * Emits an object with the necessary changes
    * @param dragEvent: CdkDragDrop
    * @emit object: {itemWithNewParent, itemsWithNewSequence}
    */
    private handleDrop(dragEvent: CdkDragDrop<any>) {
        this.isDragging = false;
        if (!this.dragPosition) return;
        let oldParentId = dragEvent.item.data.parent_id;
        let target = this.tree.find(item => item.id == this.dragPosition.id);
        let targetIndex = this.tree.findIndex(item => item.id == this.dragPosition.id);

        switch (this.dragPosition.position) {
            case 'before':
                let isFirst: boolean = targetIndex -1 <= 0;
                let previousTarget = this.tree[isFirst ? 0 : targetIndex -1];
                dragEvent.item.data.parent_id = isFirst ? null : previousTarget.systemTreeDefs.hasChildren ? previousTarget.id : previousTarget.parent_id;
                dragEvent.item.data.systemTreeDefs.level = isFirst ? 1 : previousTarget.systemTreeDefs.hasChildren ? previousTarget.systemTreeDefs.level + 1 : previousTarget.systemTreeDefs.level;
                targetIndex = isFirst ? 0 : targetIndex;
                break;
            case 'item':
                if (dragEvent.previousIndex > targetIndex) targetIndex++;
                dragEvent.item.data.systemTreeDefs.level = target.systemTreeDefs.level + 1;
                dragEvent.item.data.parent_id = target.id;
                target.systemTreeDefs.hasChildren = true;
                break;
            case 'after':
                let isLast: boolean = targetIndex >= this.tree.length - 1;
                let nextTarget = this.tree[isLast ? this.tree.length - 1 : targetIndex];
                dragEvent.item.data.systemTreeDefs.level = isLast ? 1 : nextTarget.systemTreeDefs.hasChildren ? nextTarget.systemTreeDefs.level + 1 : nextTarget.systemTreeDefs.level;
                dragEvent.item.data.parent_id = isLast ? null : nextTarget.systemTreeDefs.hasChildren ? nextTarget.id : nextTarget.parent_id;
                targetIndex = isLast ? this.tree.length - 1 : dragEvent.previousIndex > targetIndex ? targetIndex +1 : targetIndex;
                break;
        }

        let newSortSequences;
        let itemWithNewParent;

        if (dragEvent.previousIndex != targetIndex) {
            this.tree.some(item => {
                if (item.id == oldParentId) {
                    item.systemTreeDefs.hasChildren = this.sourceList.some(item => item.parent_id == oldParentId);
                    return true;
                }
            });
            moveItemInArray(this.tree, dragEvent.previousIndex, targetIndex);
            newSortSequences = this.tree
                .filter(item => item.parent_id == dragEvent.item.data.parent_id || item.parent_id == oldParentId)
                .map((item, index) => item = {id: item.id, index});

            this.tree = this.tree.map(item => {
                let index = newSortSequences.findIndex(i => i.id == item.id);
                if (index > -1) item.parent_sequence = index;
                return item;
            });
        }

        if (dragEvent.item.data.parent_id != oldParentId) {
            itemWithNewParent = {
                id: dragEvent.item.data.id,
                parent_id: dragEvent.item.data.parent_id
            };
        }


        this.dragPosition = null;
        this.onTreeDrop.emit({itemWithNewParent, newSortSequences});
    }

    private setIsDragging(value) {
        this.isDragging = value;
    }

    private handleDragPosition(pos) {
        this.dragPosition = pos;
    }

    private handleExpand(id) {
        this.sourceList.some(item => {
            if (item.id == id) {
                item.systemTreeDefs.expanded = !item.systemTreeDefs.expanded;
                return true;
            }
        });
        this.buildTree();
    }

    private handleClick(id) {
        this.tree.some(item => {
            if (item.id == id) {
                if (item.systemTreeDefs && item.systemTreeDefs.clickable) {
                    item.systemTreeDefs.isSelected = true;
                    this.selectedItemChange.emit(id);
                    this.selectedItem = id;
                } else {
                    this.handleExpand(id);
                }

                return true;
            }
        });
        this.tree.some(item => {
            if (item.id != id && item.systemTreeDefs && item.systemTreeDefs.isSelected) {
                item.systemTreeDefs.isSelected = false;
                return true;
            }
        });
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
