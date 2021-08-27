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
    templateUrl: './src/modules/servicecomponents/templates/serviceselectqueuebutton.html'
})
export class ServiceSelectQueueButton {
    constructor(
        private model: model,
        private metadata: metadata,
        private language: language,
        private modal: modal,
        private injector: Injector
    ) {

    }

    get canChange() {
        if (this.model.data.acl && !this.model.data.acl.edit) return false;

        let resolveDate = this.model.getField('resolve_date');
        if (resolveDate && resolveDate.isValid && resolveDate.isValid()) {
            return false;
        }

        return this.model.isEditing ? false : true;
    }

    private showModal() {
        if (this.canChange) {
            this.modal.openModal('ServiceSelectQueueModal', true, this.injector);
        }
    }

    private getDisplay() {
        return this.canChange ? 'inherit' : 'none';
    }
}
