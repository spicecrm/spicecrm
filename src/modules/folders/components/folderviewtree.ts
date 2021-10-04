import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {moveItemInArray} from "@angular/cdk/drag-drop";

/* @ignore */
declare var _: any;

@Component({
    selector: "folder-view-tree",
    templateUrl: "./src/modules/folders/templates/folderviewtree.html"
})

export class FolderViewTree implements OnChanges {
    /*
    * @input sourceList: object[]
    * [
    *   {
    *     id: string,
    *     parent_id: string,
    *     parent_sequence: number,
    *     name: string,
    *     clickable: boolean
    *   }
    * ]
    */
    @Input() public sourceList: any[] = [];
    /*
    * @input selectedItem: string
    */
    @Input() public selectedItem: string = "";
    /*
    * @output selectedItemChange: string = selectedItem
    * @note: selectedItem can be used as two way binding angular like:
    *        <system-tree [(selectedItem)] ></system-tree>
    */
    @Output() public selectedItemChange: EventEmitter<any> = new EventEmitter<any>();
    /*
     * @output onItemAdd: object
     * {
     *   id: string = parentId,
     *   name: string = parentName
     * }
     */
    @Output() public onItemAdd: EventEmitter<any> = new EventEmitter<any>();    /*
     * @output onTreeDrop: object
     * {
     *   itemWithNewParent?: object
     *      {
     *          id: string,
     *          parent_id: string
     *      },
     *   newSortSequences?: object
     *      {
     *          id: string,
     *          index: number
     *      }
     * }
     */
    @Output() public onTreeDrop: EventEmitter<any> = new EventEmitter<any>();

    public tree: any[] = [];
    private treeConfig: any = {
        draggable: false,
        canadd: false,
        expandall: false,
        collapsible: true,
    };

    get config() {
        return this.treeConfig;
    }

    /*
    * @input config: object
    * {
    *   draggable: boolean = false,
    *   canadd: boolean = false,
    *   expandall: boolean = false,
    *   collapsible: boolean = true
    * }
    * @set treeConfig from the input config
    */
    @Input()
    set config(obj) {
        this.treeConfig.draggable = obj.draggable || false;
        this.treeConfig.canadd = obj.canadd || false;
        this.treeConfig.expandall = obj.expandall || false;
        this.treeConfig.collapsible = obj.collapsible || true;
    }

    /*
    * @param changes: SimpleChanges
    * @build tree from sourceList
    * @handle selectedItem
    */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.sourceList) this.buildTree();
        if (changes.selectedItem) this.handleClick(this.selectedItem);
    }

    /*
    * @reset tree
    * @sort by sequence
    * @add treeItem recursively
    * @set hasChildren
    */
    private buildTree() {
        this.tree = [];
        this.sortBySequence();
        this.addTreeItem();
        this.setHasChildren();
    }

    /*
    * group the sourceList items by parent_id to succeed sorting the children by parent_sequence without
    * loosing the parent children order
    * @sort by name
    * @group by parent_id
    * @reset sourceList
    * @sort by parent_sequence
    */
    private sortBySequence() {
        this.sourceList.sort((a, b) => a.name && b.name ? a.name > b.name ? 1 : -1 : 0);
        let groupedByParent = _.groupBy(this.sourceList, item => item.parent_id);
        this.sourceList = [];
        for (let parentId in groupedByParent) {
            if (groupedByParent.hasOwnProperty(parentId)) {
                groupedByParent[parentId].sort((a, b) => a.parent_sequence && b.parent_sequence ? +a.parent_sequence > +b.parent_sequence ? 1 : -1 : 0);
                this.sourceList = [...this.sourceList, ...groupedByParent[parentId]];
            }
        }
    }

    /*
    * recursive method to push the sourceList items to the tree array with the correct parent child order
    * and add the necessary systemTreeDefs values for the item behaviours handling.
    * @param parentId: string = ''
    * @param level: number = 1
    * @set systemTreeDefs
    * @push sourceList Item to tree array
    * @call self and pass the id as parentId and the level +1
    * @structure systemTreeDefs: object
    * {
    *   level: number,
    *   expanded: boolean,
    *   clickable: boolean,
    *   isSelected: boolean,
    *   hasChildren: boolean
    * }
    */
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

    /*
    * @set hasChildren for each tree item from the sourceList
    */
    private setHasChildren() {
        this.tree.forEach(item => {
            item.systemTreeDefs.hasChildren = this.sourceList.some(i => i.parent_id == item.id);
        });
    }


    /*
    * @param id: string
    * @set item.systemTreeDefs.expanded
    * @build tree
    */
    private handleExpand(id) {
        this.sourceList.some(item => {
            if (item.id == id) {
                item.systemTreeDefs.expanded = !item.systemTreeDefs.expanded;
                return true;
            }
        });
        this.buildTree();
    }

    /*
    * if the item is clickable select it otherwise expand it and unselect the previous selected item from the tree.
    * @param id: string
    * @set? item.systemTreeDefs.isSelected
    * @set? selectedItem
    * @handle? expand
    * @emit id by @output selectedItemChange
    */
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

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.id;
    }
}
