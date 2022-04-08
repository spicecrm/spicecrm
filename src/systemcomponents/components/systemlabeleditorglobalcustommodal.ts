/**
 * @module SystemComponents
 */
import {Component, OnInit,EventEmitter} from '@angular/core';

@Component({
    templateUrl: "../templates/systemlabeleditorglobalcustommodal.html",
})
export class SystemLabelEditorGlobalCustomModal {

    /**
     * reference to the modal itself
     *
     * @private
     */
    public self: any;

    /**
     * event emitter for the label scope
     * @private
     */
    public labelscope: EventEmitter<string> = new EventEmitter<string>();


    constructor(

    ) {
    }

    public setLabel(labelScope){
        this.labelscope.emit(labelScope);
        this.self.destroy();
    }
}
