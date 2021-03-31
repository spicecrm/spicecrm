/**
 * @module ModuleContacts
 */
import {Component, ViewContainerRef, OnInit, OnDestroy} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {Subscription} from "rxjs";

/**
 * renders a button that toggles the exchange sync state
 */
@Component({
    templateUrl: "./src/modules/contacts/templates/contactexchangesyncbutton.html"
})
export class ContactExchangeSyncButton implements OnDestroy{

    /**
     * indicates that the systemis loading and executing a request
     */
    private isLoading: boolean = false;

    /**
     * the hidden status
     */
    public hidden: boolean = true;

    /**
     * the subscrtiptions
     */
    private subscriptions: Subscription = new Subscription();

    // public disabled: boolean = true;
    constructor(private metadata: metadata, private language: language, private model: model, private modal: modal, private backend: backend, private configuration: configurationService) {

        // set the hidden flag
        this.setHidden();

        // subscribe to config hcnges and potentially change the hidden flag
        this.configuration.datachanged$.subscribe(key => {
            if(key == 'exchangeuserconfig') this.setHidden();
        });

    }

    /**
     * clean up any subscriptions and unsubscribe
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private setHidden(){
        let config = this.configuration.getData('exchangeuserconfig');
        let moduleData = this.metadata.getModuleDefs('Contacts');

        this.hidden = config.findIndex(cr => cr.sysmodule_id == moduleData.id) == -1;
    }

    /**
     * button is clicked .. set or delete the sync state
     */
    public execute() {
        this.isLoading = true
        if (this.model.getField('sync_contact')) {
            this.backend.deleteRequest(`module/Contacts/${this.model.id}/exchangesync`).subscribe(
                success => {
                    this.model.setField('sync_contact', !this.model.getField('sync_contact'));
                    this.isLoading = false;
                },
                error => {
                    this.isLoading = false;
                });
        } else {
            this.backend.putRequest(`module/Contacts/${this.model.id}/exchangesync`).subscribe(
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
