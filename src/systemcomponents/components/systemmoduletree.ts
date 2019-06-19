/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output, SimpleChanges} from "@angular/core";
import {language} from "../../services/language.service";

/**
 * @ignore
 */
declare var _: any;


@Component({
    selector: "system-module-tree",
    templateUrl: "./src/systemcomponents/templates/systemmoduletree.html"
})

export class SystemModuleTree {

    @Input() public module: string;


    /**
     * event emitter when an item is selected
     */
    @Output() private itemSelected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language) {

    }

    private emitSelected(data) {
        this.itemSelected.emit(data);
    }
}
