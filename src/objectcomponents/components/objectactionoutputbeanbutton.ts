/**
 * @module ObjectComponents
 */
import {Component, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";

@Component({
    selector: 'object-action-output-bean-button',
    templateUrl: './src/objectcomponents/templates/objectactionoutputbeanbutton.html'
})
export class ObjectActionOutputBeanButton {

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    public execute() {
        this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector);
    }
}
