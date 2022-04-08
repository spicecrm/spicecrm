/**
 * @module ModuleContacts
 */
import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: "contact-newsletters-button",
    templateUrl: "../templates/contactnewslettersbutton.html"
})
export class ContactNewslettersButton implements OnInit {

    public disabled: boolean = true;

    constructor(public language: language, public model: model, public modal: modal, public ViewContainerRef: ViewContainerRef) {
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

    public handleDisabled() {
        this.disabled = !this.model.getField('email1') || this.model.isEditing || !this.model.checkAccess('edit') ? true : false;
    }
}
