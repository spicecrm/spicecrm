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
    templateUrl: "./src/systemcomponents/templates/systemmoduletree.html"
})

export class SystemModuleTree implements AfterViewInit {

    /**
     * the module to start from
     */
    @Input() public module: string;

    /**
     * event emitter when an item is selected
     */
    @Output() private itemSelected: EventEmitter<any> = new EventEmitter<any>();

    private selectedNodeId: string = '';

    constructor(private language: language) {

    }

    /**
     * emit the root path
     */
    public ngAfterViewInit(): void {
        this.selectedNodeId = 'root';
        this.itemSelected.emit({path: 'root:' + this.module, module: this.module, nodeId: 'root'});
    }

    private emitSelected(data) {
        this.selectedNodeId = data.nodeId;
        this.itemSelected.emit(data);
    }
}
