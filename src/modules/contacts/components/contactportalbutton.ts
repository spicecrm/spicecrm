import {Component, Input, HostBinding, ViewContainerRef} from "@angular/core";
import {Router} from "@angular/router";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "contact-portal-button",
    templateUrl: "./src/modules/contacts/templates/contactportalbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "[style.display]": "getDisplay()",
        "(click)" : "showPortalDetails()"
    },
    styles: [
        ":host >>> {cursor:pointer;}"
    ]
})
export class ContactPortalButton {

    constructor(private language: language, private model: model,  private metadata: metadata, private modal: modal, private ViewContainerRef: ViewContainerRef) {
    }

    private getDisplay() {
        return (!this.model.data.email1 && !this.model.data.email_address_private) || this.model.isEditing || (this.model.data.acl && !this.model.data.acl.edit) ? "none" : "inherit"
    }

    private showPortalDetails() {
        this.modal.openModal("ContactPortalDetails", true, this.ViewContainerRef.injector).subscribe(popup => {

        });
    }

}