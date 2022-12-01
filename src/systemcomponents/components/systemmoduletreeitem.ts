/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Host, Inject, Input, Output, SimpleChanges} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {modelutilities} from "../../services/modelutilities.service";
import {metadata} from "../../services/metadata.service";
import {SystemModuleTree} from "./systemmoduletree";

/**
 * @ignore
 */
declare var _: any;


@Component({
    selector: "system-module-tree-item",
    templateUrl: "../templates/systemmoduletreeitem.html"
})

export class SystemModuleTreeItem {

    /**
     * enable displaying the relationship fields
     */
    @Input() public displayRelationshipFields: boolean = false;

    /**
     * enable displaying the audit fields
     */
    @Input() public displayAuditFields: boolean = false;

    /**
     * @input selectedItemPath: string
     */
    @Input() public selectedNodeId: string = '';

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
    @Input() public nodedata: any;

    /**
     * if the node is expanded
     */
    public expanded: boolean = false;

    /**
     * the items
     */
    public nodeitems: any[] = [];

    /**
     *  indicates if the treeitem is loading
     */
    public isLoaded: boolean = false;

    /**
     *  indicates if the treeitem is loading
     */
    public isLoading: boolean = false;

    /**
     * set the button to disabled
     */
    public disabled = false;

    /**
     * event emitter when an item is selected
     */
    @Output() public itemSelected: EventEmitter<any> = new EventEmitter<any>();

    constructor(public backend: backend,
                public language: language,
                public metadata: metadata,
                @Inject(SystemModuleTree) private moduleTree: SystemModuleTree,
                public modelUtilities: modelutilities) {

    }

    get isSelected() {
        return this.selectedNodeId == this.nodedata.nodeId;
    }

    get icon() {
        return this.isLoading ? 'spinner' : 'chevronright';
    }

    /**
     * load the data from the backend
     */
    public loadItems() {
        this.isLoading = true;
        this.moduleTree.isLoading = true;
        this.backend.getRequest('dictionary/browser/' + this.module + '/nodes').subscribe(items => {
            if (items) {
                this.nodeitems = items
                    .map(item => {
                        item.nodeId = this.modelUtilities.generateGuid();
                        item.displayname = !!item.label ? this.language.getLabel(item.label) : this.language.getModuleName(item.module);
                        return item;
                    })
                    .sort((a, b) => !!a.displayname && !!b.displayname ? a.displayname > b.displayname ? 1 : -1 : 0);

                if (this.displayRelationshipFields && this.nodedata.hasRelationshipFields) {
                    this.nodeitems = [{
                        displayname: this.language.getLabel('LBL_RELATIONSHIP_FIELDS'),
                        leaf: true,
                        relationshipNode: true,
                        module: this.module,
                        parentModule: this.nodedata.parentModule,
                        link: this.nodedata.link,
                        nodeId: !this.nodedata ? 'root' : this.nodedata.nodeId,
                        path: `relationship:${this.nodedata.parentModule}:${this.nodedata.link}`
                    }, ...this.nodeitems];
                }

                // root:Contacts::link:Contacts:opportunities::audit:Opportunities:audit::field:field_name
                if (this.displayAuditFields && this.metadata.getModuleDefs(this.module).audited == 1) {
                    this.nodeitems = [{
                        displayname: this.language.getLabel('LBL_AUDIT_FIELDS'),
                        leaf: true,
                        auditNode: true,
                        module: this.module,
                        link: this.nodedata.link,
                        nodeId: !this.nodedata ? 'root' : this.nodedata.nodeId,
                        path: `audit:${this.module}:audit`
                    }, ...this.nodeitems];
                }
            }

            this.isLoading = false;
            this.moduleTree.isLoading = false;
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
    public expandItem() {
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
    public nodeSelected() {
        this.itemSelected.emit({
            path: this.path,
            module: this.module,
            parentModule: this.nodedata.parentModule,
            link: this.nodedata.link,
            nodeId: !this.nodedata ? 'root' : this.nodedata.nodeId,
            relationshipNode: this.nodedata.relationshipNode,
            auditNode: this.nodedata.auditNode,
        });
    }

    public emitSelected(data) {
        // enrich the path
        data.path = this.path + '::' + data.path;

        // emit the path
        this.itemSelected.emit(data);
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFn(index, item) {
        return item.nodeId;
    }

}
