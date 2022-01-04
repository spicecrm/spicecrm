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
    templateUrl: "../templates/emailtoleadbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "(click)" : "createLead()"
    },
    styles: [
        ":host {cursor:pointer;}"
    ]
})
export class EmailToLeadButton {


    constructor(public language: language, public metadata: metadata, public model: model, public footer: footer, public toast: toast) {}

    public createLead() {
        this.metadata.addComponent("EmailToLeadModal", this.footer.footercontainer).subscribe(popup => {
            popup.instance.email = this.model;
            popup.instance.self = popup;
        });
    }
}
