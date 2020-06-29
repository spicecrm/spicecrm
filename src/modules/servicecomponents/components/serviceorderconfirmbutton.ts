/**
 * @module ServiceComponentsModule
 */
import {Component, Injector} from "@angular/core";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";


@Component({
    templateUrl: "./src/modules/servicecomponents/templates/serviceorderconfirmbutton.html"
})
export class ServiceOrderConfirmButton {
    constructor(
        private model: model,
        private modal: modal,
        private injector: Injector,
    ) {
    }

    private execute() {
        this.modal.openModal("ServiceOrderConfirmModal", true, this.injector);
    }

    get display() {
        if (this.model.data.acl && !this.model.data.acl.edit) {
            return false;
        }
        return this.model.isEditing ? false : true;
    }
}
