/**
 * @module SystemComponents
 */
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import {language} from "../../services/language.service";

/**
 * @ignore
 */
declare var _: any;


@Component({
    selector: "system-module-tree",
    templateUrl: "../templates/systemmoduletree.html"
})

export class SystemModuleTree implements AfterViewInit {

    /**
     * enable displaying the audit fields
     */
    @Input() public displayAuditFields: boolean = false;

    /**
     * enable displaying the relationship fields
     */
    @Input() public displayRelationshipFields: boolean = false;

    /**
     * the module to start from
     */
    @Input() public module: string;

    /**
     * event emitter when an item is selected
     */
    @Output() public itemSelected: EventEmitter<any> = new EventEmitter<any>();

    public selectedNodeId: string = '';
    /**
     * if nodes are loading
     */
    public isLoading = false;

    constructor(public language: language) {

    }

    /**
     * emit the root path
     */
    public ngAfterViewInit(): void {
        this.selectedNodeId = 'root';
        this.itemSelected.emit({path: 'root:' + this.module, module: this.module, nodeId: 'root'});
    }

    public emitSelected(data) {
        this.selectedNodeId = data.nodeId;
        this.itemSelected.emit(data);
    }
}
