/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output, SimpleChanges} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";

/**
 * @ignore
 */
declare var _: any;


@Component({
    selector: "system-module-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemmoduletreeitem.html"
})

export class SystemModuleTreeItem {

    /**
     * the level we are on
     */
    @Input() public level: number = 1;

    /**
     * the level we are on
     */
    @Input() public path: string;

    /**
     * the module of the item
     */
    @Input() public module: string;

    /**
     * the name to be displayed
     */
    @Input() public name: string;

    /**
     * nodedata
     */
    @Input() public nodedata: string;

    /**
     * if the node is expanded
     */
    private expanded: boolean = false;

    /**
     * the items
     */
    private nodeitems: any[] = [];

    /**
     *  indicates if the treeitem is loading
     */
    private isLoaded: boolean = false;

    /**
     *  indicates if the treeitem is loading
     */
    private isLoading: boolean = false;

    /**
     * set the button to disabled
     */
    private disabled = false;

    /**
     * event emitter when an item is selected
     */
    @Output() private itemSelected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private language: language) {

    }

    get icon() {
        return this.isLoading ? 'spinner' : 'chevronright';
    }

    /**
     * load the data from the backend
     */
    private loadItems() {
        this.isLoading = true;
        this.backend.getRequest('/dictionary/browser/' + this.module + '/nodes').subscribe(items => {

            for (let item of items) {
                item.displayname = this.language.getLabel(item.label);
                this.nodeitems.push(item);
            }
            this.nodeitems.sort((a, b) => !!this.language.getLabel(a.label) && !!this.language.getLabel(b.label) ?
                this.language.getLabel(a.label).toLowerCase() > this.language.getLabel(b.label).toLowerCase() ? 1 : -1 : 0);

            this.isLoading = false;
            this.isLoaded = true;
            if (this.nodeitems.length > 0) {
                this.expanded = true;
            } else {
                this.disabled = true;
            }
        });
    }

    /**
     * toggle the treeitem open
     */
    private expandItem() {
        // if is loading do nothing
        if (this.isLoading) return;

        // check if we are laoded
        if (!this.isLoaded) {
            this.loadItems();
        } else {
            this.expanded = !this.expanded;
        }
    }

    /**
     * handler to emit when a node is selected
     */
    private nodeSelected() {
        // console.log(this.path);
        this.itemSelected.emit({path: this.path, module: this.module});
    }

    private emitSelected(data) {
        // enrich the path
        data.path = this.path + '::' + data.path;

        // emit the path
        this.itemSelected.emit(data);
    }

}
