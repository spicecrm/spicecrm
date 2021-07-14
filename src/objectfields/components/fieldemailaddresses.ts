/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectFields
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {broadcast} from "../../services/broadcast.service";

declare var _;

/**
 * Handle displaying and managing multiple email addresses
 */
@Component({
    selector: 'field-email-addresses',
    templateUrl: './src/objectfields/templates/fieldemailaddresses.html'
})
export class fieldEmailAddresses extends fieldGeneric implements OnInit {
    /**
     * holds the input radio unique name for the primary radio button
     */
    public primaryInputRadioName: string = _.uniqueId('field-email-address-');
    /**
     * holds the can add boolean to display/hide add button
     */
    public canAdd: boolean = false;
    /**
     * holds the email addresses locally
     */
    public emailAddresses = [];

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public broadcast: broadcast,
                public router: Router) {
        super(model, view, language, metadata, router);
        this.subscribeToDataChange();
    }

    /**
     * call to initialize the field value and subscribe to mode changes
     */
    public ngOnInit() {
        this.initialize();
        this.subscribeToModeChange();
    }

    /**
     * delete the email address from the array triggered by delete button
     * @param emailAddress
     */
    public handleOnDelete(emailAddress) {

        // if we have only one entry clear the input otherwise remove it
        if (this.emailAddresses.length > 1) {
            this.emailAddresses = this.emailAddresses.filter(e => e.id !== emailAddress.id);
        } else {
            emailAddress.email_address = '';
            emailAddress.email_address_caps = '';
        }

        this.model.setField('emailaddresses', this.getUniqueCleanEmailAddresses());

        if (this.model.getField('emailaddresses').length == 0) {
            this.setEmail1Field(undefined);
        }

        this.setCanAdd();
        this.handleFieldInvalid();
    }

    /**
     * open the email link by mailto in browser
     * @param emailAddress
     */
    public sendEmail(emailAddress) {
        if (emailAddress.invalid_email == 1) return;
        window.location.assign('mailto:' + emailAddress.email_address);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     */
    public trackByFn(index, item): string | number {
        return item.id;
    }

    /**
     * set the primary email address
     * @param emailaddress
     */
    public setPrimary(emailaddress) {

        if (emailaddress.invalid_email == 1) {
            return;
        }

        this.emailAddresses.forEach(addr => {
            if (addr.id == emailaddress.id) {
                addr.primary_address = '1';
                this.model.setField('email1', emailaddress.email_address);
            } else {
                addr.primary_address = '0';
            }
        });
        this.model.setField('emailaddresses', this.getUniqueCleanEmailAddresses());
    }

    /**
     * push an empty email address to the array
     * disable adding new one before typing in
     * @param hasFocus
     */
    public addEmailAddress(hasFocus?) {

        if (!this.canAdd) return;

        const newEmailAddress = {
            id: this.model.generateGuid(),
            bean_id: this.model.id,
            bean_module: this.model.module,
            email_address: '',
            email_address_id: '',
            primary_address: this.emailAddresses.some(e => e.primary_address == '1') ? '0' : '1',
            hasFocus
        };

        this.emailAddresses.push(newEmailAddress);
        this.model.setField('emailaddresses', this.getUniqueCleanEmailAddresses());
        this.canAdd = false;
    }

    /**
     * subscribe to model.loaded broadcast message
     * @private
     */
    private subscribeToDataChange() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => {
                if (msg.messagetype != 'model.loaded') return;
                this.initialize();
            })
        );

    }

    /**
     * set email1 field value
     * @param emailAddress
     * @param ignoreInvalid
     * @private
     */
    private setEmail1Field(emailAddress, ignoreInvalid?: boolean) {
        if (emailAddress?.invalid_email == 1 || emailAddress?.email_address == this.model.getField('email1')) {
            return;
        }
        this.model.setField('email1', emailAddress?.email_address);
    }

    /**
     * subscribe to mode change to initialize a new email address if needed
     * @private
     */
    private subscribeToModeChange() {
        this.subscriptions.add(
            this.view.mode$.subscribe(() => this.initialize())
        );
    }

    /**
     * if the field is undefined set the initial value
     * set field status and can add value
     * @private
     */
    private initialize() {

        this.emailAddresses = this.model.getField('emailaddresses');

        if (!this.isEditMode()) return;

        if (!Array.isArray(this.emailAddresses) || this.emailAddresses.length == 0) {
            this.model.initializeField('emailaddresses', []);
            this.emailAddresses = [];
            this.canAdd = true;
            this.addEmailAddress();
        }

        this.setCanAdd();
        this.handleFieldInvalid();
    }

    /**
     * set the email addresses field after handling the entries
     * set field invalid status
     * set can add boolean
     * @private
     */
    private setEmailAddressesField() {
        const emailAddresses = this.getUniqueCleanEmailAddresses();
        this.model.setField('emailaddresses', emailAddresses);
        this.handleFieldInvalid();
        this.setEmail1Field(
            emailAddresses.find(e => e.primary_address == '1')
        );
        this.setCanAdd();
    }

    /**
     * handle setting/clearing the field message for invalid status
     * @private
     */
    private handleFieldInvalid() {
        if (this.emailAddresses.some(e => e.invalid_email == 1)) {
            this.setFieldError(this.language.getLabel('LBL_INPUT_INVALID'));
        } else {
            this.clearFieldError();
        }
    }

    /**
     * set can add boolean if all email addresses are valid and we are not in single mode
     * @private
     */
    private setCanAdd() {
        this.canAdd = !this.fieldconfig.singleMode ?
            !this.emailAddresses.some(emailAddress => emailAddress.invalid_email == 1) : this.emailAddresses.length == 0;
    }

    /**
     * @return the unique email addresses and filter out the empty once
     * @private
     */
    private getUniqueCleanEmailAddresses(): any[] {

        const emailAddresses = [];

        this.emailAddresses
            .filter(emailAddress => !!emailAddress.email_address)
            .forEach(emailAddress => {
                if (!emailAddresses.some(e => e.email_address == emailAddress.email_address)) {
                    delete emailAddress.hasFocus;
                    emailAddresses.push(emailAddress);
                }
            });
        return emailAddresses;
    }
}

