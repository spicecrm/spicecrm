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
    templateUrl: "../templates/contactportalbutton.html"
})
export class ContactPortalButton implements OnInit {

    public disabled: boolean = true;

    constructor(public language: language, public model: model, public metadata: metadata, public modal: modal, public viewContainerRef: ViewContainerRef) {
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

    public handleDisabled() {
        this.disabled = !((this.model.getField('email1') || this.model.getField('email_address_private')) && !this.model.isEditing && this.model.checkAccess('edit'));
    }

    public execute() {
        this.modal.openModal("ContactPortalDetails", true, this.viewContainerRef.injector);
    }
}
