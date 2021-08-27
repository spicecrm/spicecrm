/**
 * @module ModuleContacts
 */
import {Component, ViewContainerRef, OnInit} from "@angular/core";

import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "contact-portal-button",
    templateUrl: "./src/modules/contacts/templates/contactportalbutton.html"
})
export class ContactPortalButton implements OnInit {

    public disabled: boolean = true;

    constructor(private language: language, private model: model, private metadata: metadata, private modal: modal, private viewContainerRef: ViewContainerRef) {
    }

    public ngOnInit() {
        this.handleDisabled();
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    private handleDisabled() {
        this.disabled = !((this.model.data.email1 || this.model.data.email_address_private) && !this.model.isEditing && this.model.checkAccess('edit'));
    }

    private execute() {
        this.modal.openModal("ContactPortalDetails", true, this.viewContainerRef.injector);
    }
}
