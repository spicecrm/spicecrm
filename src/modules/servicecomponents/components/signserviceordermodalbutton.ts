/**
 * @module ServiceComponentsModule
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {footer} from "../../../services/footer.service";
import {SignServiceOrderModalComponent} from "./signserviceordermodal";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";


@Component({
    selector: "sign-serviceorder-modal-button",
    templateUrl: "./src/modules/servicecomponents/templates/signserviceordermodalbutton.html"
})
export class SignServiceOrderModalButtonComponent {
    constructor(
        private model: model,
        private metadata: metadata,
        private language: language,
        private footer: footer,
        private modalservice: modal
    ) {
    }

    private execute() {
        this.modalservice.openModal("SignServiceOrderModalComponent").subscribe(
            cmp => {
                cmp.instance.setModel(this.model);
            },
            error => {
                console.error(error);
            }
        );
    }

    get display() {
        if (this.model.data.acl && !this.model.data.acl.edit) {
            return false;
        }

        return this.model.isEditing ? false : true;
    }
}
