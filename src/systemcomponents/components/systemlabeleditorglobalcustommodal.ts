/**
 * @module SystemComponents
 */
import {Component, OnInit,EventEmitter} from '@angular/core';

@Component({
    templateUrl: "./src/systemcomponents/templates/systemlabeleditorglobalcustommodal.html",
})
export class SystemLabelEditorGlobalCustomModal {

    /**
     * reference to the modal itself
     *
     * @private
     */
    private self: any;

    /**
     * event emitter for the label scope
     * @private
     */
    private labelscope: EventEmitter<string> = new EventEmitter<string>();


    constructor(

    ) {
    }

    private setLabel(labelScope){
        this.labelscope.emit(labelScope);
        this.self.destroy();
    }
}
