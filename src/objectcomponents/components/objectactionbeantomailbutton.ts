import {Component, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";

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
    // should be inject the parent to the modal???
    public execute() {
        this.modal.openModal('ObjectActionMailModal', true, this.viewContainerRef.injector)
            .subscribe(ref => ref.instance.parent = this.model);
    }
}
