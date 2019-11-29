/**
 * @module ModuleContacts
 */
import {Component, ViewContainerRef, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";

/**
 * renders a button that toggles the exchange sync state
 */
@Component({
    templateUrl: "./src/modules/contacts/templates/contactexchangesyncbutton.html"
})
export class ContactExchangeSyncButton {

    /**
     * indicates that the systemis loading and executing a request
     */
    private isLoading: boolean = false;

    // public disabled: boolean = true;
    constructor(private language: language, private model: model, private modal: modal, private backend: backend) {
    }

    /**
     * button is clicked .. set or delete the sync state
     */
    public execute() {
        this.isLoading = true
        if (this.model.getField('sync_contact')) {
            this.backend.deleteRequest(`module/Contacts/${this.model.id}/exchangeSync`).subscribe(
                success => {
                    this.model.setField('sync_contact', !this.model.getField('sync_contact'));
                    this.isLoading = false;
                },
                error => {
                    this.isLoading = false;
                });
        } else {
            this.backend.putRequest(`module/Contacts/${this.model.id}/exchangeSync`).subscribe(
                success => {
                    this.model.setField('sync_contact', !this.model.getField('sync_contact'));
                    this.isLoading = false;
                },
                error => {
                    this.isLoading = false;
                });
        }
    }

    /**
     * handle the disbaled state of the button
     *
     * also limited to Exchange that an email needs to be present
     * ToDo: check how to create a contact without an email address
     */
    get disabled() {
        return this.isLoading || this.model.isLoading || !this.model.getField('email1') || this.model.isEditing ? true : false;
    }

    get syncicon() {
        return this.model.getField('sync_contact') ? 'check' : 'add';
    }
}
