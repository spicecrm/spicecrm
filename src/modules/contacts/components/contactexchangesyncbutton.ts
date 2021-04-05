/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
