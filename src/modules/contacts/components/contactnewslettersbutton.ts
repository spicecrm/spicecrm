/**
 * @module ModuleContacts
 */
import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "contact-newsletters-button",
    templateUrl: "./src/modules/contacts/templates/contactnewslettersbutton.html"
})
export class ContactNewslettersButton implements OnInit {

    public disabled: boolean = true;

    constructor(private language: language, private model: model, private modal: modal, private ViewContainerRef: ViewContainerRef) {
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

    public execute() {
        this.modal.openModal("ContactNewsletters", true, this.ViewContainerRef.injector);
    }

    private handleDisabled() {
        this.disabled = !this.model.data.email1 || this.model.isEditing || (this.model.data.acl && !this.model.data.acl.edit) ? true : false;
    }
}
