/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

/* @ignore */
declare var _: any;

@Component({
    selector: "system-tree",
    templateUrl: "./src/systemcomponents/templates/systemtree.html",
    styles: ['.cdk-drag-animating {transition: none}']
})

export class SystemTree implements OnChanges {
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
    * Handles the cdkDrop event and move the item in the tree depending its drop position
    * Change the parent_id for the item and its level depending on its drop position and reassign hasChildren
    * emits the necessary changes as @output by onTreeDrop.
    * @param dragEvent: CdkDragDrop
    * @define necessary variables
    * @set droppedItem.parent_id
    * @set droppedItem.level
    * @set target.systemTreeDefs.hasChildren
    * @move droppedItem in tree array
    * @reset dragPosition
    * @emit object: {itemWithNewParent, itemsWithNewSequence} by @output onTreeDrop
    */
    private handleDrop(dragEvent: CdkDragDrop<any>) {
        this.isDragging = false;
        if (!this.dragPosition) return;
        let oldParentId = dragEvent.item.data.parent_id;
        let target = this.tree.find(item => item.id == this.dragPosition.id);
        let targetIndex = this.tree.findIndex(item => item.id == this.dragPosition.id);

        switch (this.dragPosition.position) {
            case 'before':
                let isFirst: boolean = targetIndex - 1 <= 0;
                let previousTarget = this.tree[isFirst ? 0 : targetIndex - 1];
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
                targetIndex = isLast ? this.tree.length - 1 : dragEvent.previousIndex > targetIndex ? targetIndex + 1 : targetIndex;
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

    /*
    * @param value
    * @set isDragging
    */
    private setIsDragging(value) {
        this.isDragging = value;
    }

    /*
    * @param pos: null | object = {id: string, position: 'before' | 'item' | 'after'}
    * @set dragPosition
    */
    private handleDragPosition(pos) {
        this.dragPosition = pos;
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
