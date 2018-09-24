import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";

@Component({
    selector: "system-tree",
    templateUrl: "./src/systemcomponents/templates/systemtree.html"
})
export class SystemTree implements OnChanges {
    @Input() public treelist: any = [];
    @Output() public selectedOutputItem: EventEmitter<any> = new EventEmitter<any>();

    public selectedId: string = "";
    private tree: Array<any> = [];

    //  -- INPUT LIST STRUCTURE --
    // id
    // parent_id
    // name
    // selected
    // clickable


    public ngOnChanges(changes: SimpleChanges) {
        this.tree = this.buildTree(this.treelist);
    }

    private buildTree(treelist, parent = null, level = 0, parentpath = []) {

        let tree = [];

        for (let i in treelist) {
            if (treelist[i].parent_id == parent) {

                treelist[i].expanded = false;
                treelist[i].level = level + 1;

                treelist[i].path = parentpath.slice(); // copy path
                treelist[i].path[level] = treelist[i].id;

                level++;
                let children = this.buildTree(treelist, treelist[i].id, level, treelist[i].path);
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


    public selectedItem(item: any) {
        // set the selected id
        this.selectedId = item.id;

        // emit the selected value
        this.selectedOutputItem.emit(item);
    }
}
