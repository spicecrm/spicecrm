import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
    selector: 'system-tree',
    templateUrl: './app/systemcomponents/templates/systemtree.html'
})
export class SystemTree implements OnChanges {
    @Input() treelist: any = [];
    @Output() selectedOutputItem: EventEmitter<any> = new EventEmitter<any>();

    tree: Array<any> = [];

    constructor() {
    }

    //  -- INPUT LIST STRUCTURE --
    // id
    // parent_id
    // name
    // selected
    // clickable


    ngOnChanges(changes: SimpleChanges) {
        this.tree = this.buildTree(this.treelist);
    }


    buildTree(treelist, parent = null, level = 0, parentpath = []) {

        var tree = [];

        for (var i in treelist) {
            if (treelist[i].parent_id == parent) {

                treelist[i].expanded = false;
                treelist[i].level = level + 1;

                treelist[i].path = parentpath.slice(); //copy path
                treelist[i].path[level] = treelist[i].id;

                level++;
                var children = this.buildTree(treelist, treelist[i].id, level, treelist[i].path);
                level--;
                delete treelist[i].path[level + 1];

                if (children.length) {
                    treelist[i].children = children;
                } else {
                    treelist[i].children = [];
                }

                // set expanded if child is selected or also expanded
                for(let child of children){
                    if(child.selected || child.expanded){
                        treelist[i].expanded = true;
                    }
                }

                tree.push(treelist[i]);
            }
        }
        return tree;
    }


    selectedItem(item: any) {
        this.selectedOutputItem.emit(item);
    }
}