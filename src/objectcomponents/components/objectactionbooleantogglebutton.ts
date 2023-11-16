/**
 * @module ObjectComponents
 */
import {Component, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";

/**
 * a generic component for an action set on an object that allows the toggling of a boolean field
 */
@Component({
    selector: 'object-action-boolean-toggle-button',
    templateUrl: '../templates/objectactionbooleantogglebutton.html'
})
export class ObjectActionBooleanToggleButton {

    /**
     * the actionconfig passed in from the actionset
     */
    public actionconfig: any;

    constructor(
        public language: language,
        public model: model,
        public viewContainerRef: ViewContainerRef,
        public toast: toast,
    ) {

    }

    /**
     * this button flips the content of a boolean field
     */
    public execute() {
        // todo ask how to check for fieldtype
        if (this.actionconfig.fieldtotoggle) {
            if (this.model.getField(this.actionconfig.fieldtotoggle) && !this.actionconfig.onlysettoone) {
                this.model.setField(this.actionconfig.fieldtotoggle, 0);
                this.model.save()
            } else {
                if (this.model.getField(this.actionconfig.fieldtotoggle) == 1) {
                    return
                } else {
                    this.model.setField(this.actionconfig.fieldtotoggle, 1);
                    this.model.save()
                }
            }
        }
    }
}
