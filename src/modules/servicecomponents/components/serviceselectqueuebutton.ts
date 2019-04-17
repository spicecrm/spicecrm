/**
 * @module ServiceComponentsModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {SignServiceOrderModalComponent} from "./signserviceordermodal";
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
            this.modal.openModal('ServiceSelectQueueModal').subscribe(
                cmp => {
                    cmp.instance.parentqueue_id = this.model.getField('servicequeue_id');
                    cmp.instance.displaynote = true;
                    cmp.instance.selectedqueue.subscribe(response => {
                        if (response != false) {
                            if (!this.model.isEditing) {
                                this.model.setField('servicequeue_id', response.servicequeue_id);
                                this.model.setField('servicequeue_name', response.servicequeue_name);
                            } else {
                                this.model.startEdit();
                                this.model.setField('servicequeue_id', response.servicequeue_id);
                                this.model.setField('servicequeue_name', response.servicequeue_name);
                                this.model.save();
                            }
                        }
                    });
                }
            );
        }
    }

    private getDisplay() {
        return this.canChange ? 'inherit' : 'none';
    }
}
