/**
 * @module ServiceComponentsModule
 */
import {Component, SkipSelf, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {ServiceSelectQueueModal} from "./serviceselectqueuemodal";


@Component({
    selector: 'service-select-queue-button',
    templateUrl: '../templates/serviceselectqueuebutton.html'
})
export class ServiceSelectQueueButton {
    constructor(
        public model: model,
        public metadata: metadata,
        public language: language,
        public modal: modal,
        public injector: Injector
    ) {

    }

    get canChange() {
        if (!this.model.checkAccess('edit')) return false;

        let resolveDate = this.model.getField('resolve_date');
        if (resolveDate && resolveDate.isValid && resolveDate.isValid()) {
            return false;
        }

        return this.model.isEditing ? false : true;
    }

    public showModal() {
        if (this.canChange) {
            this.modal.openModal('ServiceSelectQueueModal', true, this.injector);
        }
    }

    public getDisplay() {
        return this.canChange ? 'inherit' : 'none';
    }
}
