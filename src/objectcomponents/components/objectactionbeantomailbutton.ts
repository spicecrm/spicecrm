/**
 * @module ObjectComponents
 */
import {Component, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";

/**
 * a generic component for an action set on an bject that allows sending the bean as an email by seleting an email template
 */
@Component({
    selector: 'object-action-beantomail-button',
    templateUrl: './src/objectcomponents/templates/objectactionbeantomailbutton.html'
})
export class ObjectActionBeanToMailButton {

    constructor(
        private language: language,
        private modal: modal,
        private model: model,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    /**
     * the method invoed when selecting the action. This triggers opening a modal window for the email composition
     */
    public execute() {
        this.modal.openModal('ObjectActionMailModal', true, this.viewContainerRef.injector)
            .subscribe(ref => ref.instance.parent = this.model);
    }
}
