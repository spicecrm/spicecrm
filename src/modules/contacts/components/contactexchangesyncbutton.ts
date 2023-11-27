/**
 * @module ModuleContacts
 */
import {Component, ViewContainerRef, OnInit, OnDestroy} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {Subscription} from "rxjs";
import {userpreferences} from "../../../services/userpreferences.service";

/**
 * renders a button that toggles the exchange sync state
 */
@Component({
    templateUrl: "../templates/contactexchangesyncbutton.html"
})
export class ContactExchangeSyncButton implements OnDestroy {

    /**
     * indicates that the systemis loading and executing a request
     */
    public isLoading: boolean = false;

    /**
     * the hidden status
     */
    public hidden: boolean = true;

    /**
     * the route definition depending on the sync t<pe msgraph | exchange
     */
    public route: string = '';

    /**
     * the subscrtiptions
     */
    public subscriptions: Subscription = new Subscription();

    // public disabled: boolean = true;
    constructor(public metadata: metadata, public toast: toast, public language: language, public model: model, public modal: modal, public backend: backend, public configuration: configurationService, public userpreferences: userpreferences) {

        // set the hidden flag
        this.setHidden();

        // subscribe to config hcnges and potentially change the hidden flag
        this.configuration.datachanged$.subscribe(key => {
            if (key == 'microsoftserviceuserconfig') this.setHidden();
        });

        // check if the user uses ews or msgraph
        this.setRoute();
    }

    /**
     * clean up any subscriptions and unsubscribe
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public setHidden() {
        let config = this.configuration.getData('microsoftserviceuserconfig');
        let moduleData = this.metadata.getModuleDefs('Contacts');

        if(typeof config === 'object'){
            Object.keys(config).forEach(item => {
                if(config[item].sysmodule_id == moduleData.id){
                    this.hidden = false;
                }
            });
        }
        else{ // old logic
            this.hidden = !config || (config && config?.findIndex(cr => cr.sysmodule_id == moduleData.id) == -1);
        }
    }

    /**
     * sets the route depending on the selected sync msgraph | ews
     */
    public setRoute(){
        this.route = 'module/Contacts/' + this.model.id;
        switch(this.userpreferences.getPreference('microsoftActiveService')){
            case 'msgraph':
                this.route+= '/msgraphsync';
                break;
            default:
                this.route+= '/exchangesync';
        }
    }

    /**
     * button is clicked .. set or delete the sync state
     */
    public execute() {
        this.isLoading = true;
        if (this.model.getField('sync_contact')) {
            this.backend.deleteRequest(this.route).subscribe(
                success => {
                    this.model.setField('sync_contact', !this.model.getField('sync_contact'));
                    this.isLoading = false;
                },
                error => {
                    this.isLoading = false;
                });
        } else {
            this.backend.putRequest(this.route).subscribe(
                success => {
                    if (success.message) {
                        this.toast.sendToast(success.message, 'error');
                    } else {
                        this.model.setField('sync_contact', !this.model.getField('sync_contact'));
                    }
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
