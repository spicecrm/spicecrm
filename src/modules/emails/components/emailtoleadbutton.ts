/**
 * @module ModuleEmails
 */
import {Component} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {footer} from "../../../services/footer.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "./src/modules/emails/templates/emailtoleadbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "(click)" : "createLead()"
    },
    styles: [
        ":host {cursor:pointer;}"
    ]
})
export class EmailToLeadButton {


    constructor(private language: language, private metadata: metadata, private model: model, private footer: footer, private toast: toast) {}

    private createLead() {
        this.metadata.addComponent("EmailToLeadModal", this.footer.footercontainer).subscribe(popup => {
            popup.instance.email = this.model;
            popup.instance.self = popup;
        });
    }
}
