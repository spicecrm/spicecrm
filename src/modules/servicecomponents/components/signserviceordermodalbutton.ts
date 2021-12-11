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
    templateUrl: "../templates/signserviceordermodalbutton.html"
})
export class SignServiceOrderModalButtonComponent {
    constructor(
        public model: model,
        public metadata: metadata,
        public language: language,
        public footer: footer,
        public modalservice: modal
    ) {
    }

    public execute() {
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
