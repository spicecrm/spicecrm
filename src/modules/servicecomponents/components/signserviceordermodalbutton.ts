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
    templateUrl: "./src/modules/servicecomponents/templates/signserviceordermodalbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "[style.display]": "getDisplay()"
    },
    styles: [
        ":host {cursor:pointer;}"
    ]
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

    private showModal() {
        this.modalservice.openModal("SignServiceOrderModalComponent").subscribe(
            cmp => {
                cmp.instance.setModel(this.model);
            },
            error => {
                console.error(error);
            }
        );
    }

    private getDisplay() {
        if (this.model.data.acl && !this.model.data.acl.edit) {
            return "none";
        }

        return this.model.isEditing ? "none" : "inherit";
    }
}
