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
    templateUrl: '../templates/fieldemailaddresses.html'
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
     * true to display/hide input new email address
     */
    public isAdding: boolean = false;
    /**
     * holds the email addresses locally
     */
    public emailAddresses = [];
    /**
     * holds the new input email address data
     */
    public inputNewEmailAddress: {id?, primary_address, invalid_email, email_address, hasFocus?, opt_in_status?, isNew?} = {
        primary_address: '', invalid_email: 0, email_address: '', hasFocus: true
    };

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
    public handleOnDelete(emailAddress: {id?, primary_address, invalid_email, email_address, hasFocus?, opt_in_status?, isNew?}) {

        this.emailAddresses = this.emailAddresses.filter(e => e.id !== emailAddress.id);

        if (!emailAddress.isNew) {
            this.model.removeRelatedRecords('email_addresses', [emailAddress.id]);
        } else {
            this.model.setRelatedRecords('email_addresses', this.emailAddresses);
        }

        if (this.emailAddresses.length == 0) {
            this.setEmail1Field(undefined);
        }

        if (!!this.fieldconfig.singleMode) {
            this.canAdd = true;
            this.startAdding();
        }

        // enforce a duplicate check
        this.model.duplicateCheckOnChange([], true);

        this.handleFieldInvalid();
    }

    /**
     * open the email link by mailto in browser
     * @param emailAddress
     */
    public sendEmail(emailAddress: {id?, primary_address, invalid_email, email_address, hasFocus?, opt_in_status?, isNew?}) {
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
     * @param emailAddress
     */
    public setPrimary(emailAddress: {id?, primary_address, invalid_email, email_address, hasFocus?, opt_in_status?, isNew?}) {

        if (emailAddress.invalid_email == 1) {
            return;
        }

        this.emailAddresses.forEach(addr => {
            if (addr.id == emailAddress.id) {
                addr.primary_address = '1';
                this.setEmail1Field(emailAddress);
            } else {
                addr.primary_address = '0';
            }
        });
        this.model.addRelatedRecords('email_addresses', this.emailAddresses);
    }

    /**
     * push an empty email address to the array
     * disable adding new one before typing in
     */
    public startAdding() {

        if (!this.canAdd) return;

        this.isAdding = true;
        this.canAdd = false;
    }

    /**
     * subscribe to model.loaded broadcast message
     * @private
     */
    public subscribeToDataChange() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => {
                if (msg.messagetype != 'model.loaded') return;
                this.initialize();
            })
        );

        this.subscriptions.add(
            this.model.observeFieldChanges('email_addresses').subscribe(() => {
                const email_addresses = this.model.getRelatedRecords('email_addresses');
                this.emailAddresses = !this.fieldconfig.singleMode ? email_addresses : email_addresses.filter(e => e.primary_address == 1);

                // check if we have at least one email address and if we are in is adding but no email has been inputted
                // this is the case if we have a new record or edit an existing without email address but from other areas an email address is added
                // then cancel the adding process so only the now one email address remains
                if(email_addresses.length > 0 && this.isAdding){
                    if(!this.inputNewEmailAddress.email_address) this.isAdding = false;
                }

            })
        );
    }

    /**
     * set email1 field value
     * @param emailAddress
     * @private
     */
    public setEmail1Field(emailAddress: {id?, primary_address, invalid_email, email_address, hasFocus?, opt_in_status?, isNew?}) {
        if (emailAddress?.invalid_email == 1 || emailAddress?.email_address == this.model.getField('email1')) {
            return;
        }
        this.model.setField('email1', emailAddress?.email_address);
    }

    /**
     * subscribe to mode change to initialize a new email address if needed
     * @private
     */
    public subscribeToModeChange() {
        this.subscriptions.add(
            this.view.mode$.subscribe(() => this.initialize())
        );
    }

    /**
     * if the field is undefined set the initial value
     * set field status and can add value
     * @private
     */
    public initialize() {

        const email_addresses = this.model.getRelatedRecords('email_addresses');
        this.emailAddresses = !this.fieldconfig.singleMode ? email_addresses : email_addresses.filter(e => e.primary_address == 1);

        if (!this.isEditMode()) return;

        if (!Array.isArray(this.emailAddresses) || this.emailAddresses.length == 0) {
            this.model.initializeField('email_addresses', {beans: {}, beans_relations_to_delete: {}});
            this.emailAddresses = [];
            this.canAdd = true;
            this.startAdding();
        } else {
            this.setCanAdd();
        }

        this.handleFieldInvalid();
    }

    /**
     * set the email addresses field after handling the entries
     * set field invalid status
     * set can add boolean
     * @private
     */
    public setEmailAddressesField() {

        this.pushNewEmailAddress();

        const emailAddresses = this.getUniqueCleanEmailAddresses();
        this.model.addRelatedRecords('email_addresses', emailAddresses.unique);
        this.model.removeRelatedRecords('email_addresses', emailAddresses.deletedIds);

        let invalid = this.handleFieldInvalid();
        this.setEmail1Field(
            emailAddresses.unique.find(e => e.primary_address == '1')
        );

        // if the field is not invalid
        if(invalid == false) {
            this.model.duplicateCheckOnChange([], true);
        }

        this.setCanAdd();
    }

    /**
     * push the new input email address to the emailAddresses array
     */
    public pushNewEmailAddress() {

        if (!this.isAdding || this.inputNewEmailAddress.invalid_email == 1 || this.emailAddresses.some(e => e.email_address == this.inputNewEmailAddress.email_address)) return;

        if (this.emailAddresses.length == 0) {
            this.inputNewEmailAddress.primary_address = 1;
        }
        this.inputNewEmailAddress.id = this.model.generateGuid();
        this.inputNewEmailAddress.isNew = true;

        this.emailAddresses.push({...this.inputNewEmailAddress});
        this.cancelAdding();
    }
    /**
     * handle setting/clearing the field message for invalid status
     * returns ture if invalid, otherwise false
     *
     * @private
     */
    public handleFieldInvalid() {
        if (((this.emailAddresses.length == 1 && !!this.emailAddresses[0].email_address) || this.emailAddresses.length > 1) && this.emailAddresses.some(e => e.invalid_email == 1)) {
            this.setFieldError(this.language.getLabel('LBL_INPUT_INVALID'));
            return true;
        } else {
            if (this.emailAddresses.length == 1) {
                this.emailAddresses[0].invalid_email = 0;
            }
            this.clearFieldError();
            return false;
        }
    }

    /**
     * set can add boolean if all email addresses are valid and we are not in single mode
     * @private
     */
    public setCanAdd() {
        this.canAdd = !this.fieldconfig.singleMode ?
            !this.emailAddresses.some(emailAddress => emailAddress.invalid_email == 1) : this.emailAddresses.length == 0;
    }

    /**
     * return unique email addresses and filter out the empty once
     * @return any[]
     * @private
     */
    public getUniqueCleanEmailAddresses(): {deletedIds, unique} {

        const unique = [];
        const deletedIds = this.emailAddresses.filter(emailAddress => !emailAddress.email_address).map(e => e.id);

        this.emailAddresses
            .filter(emailAddress => !!emailAddress.email_address)
            .forEach(emailAddress => {
                if (!unique.some(e => e.email_address == emailAddress.email_address)) {
                    delete emailAddress.hasFocus;
                    unique.push(emailAddress);
                } else if (!emailAddress.isNew) {
                    deletedIds.push(emailAddress.id);
                }
            });

        return {deletedIds, unique};
    }

    /**
     * clear the email address input data
     */
    public cancelAdding() {

        this.inputNewEmailAddress = {
            id: '', primary_address: '', invalid_email: 0, email_address: '', hasFocus: true
        };

        if (this.emailAddresses.length > 0) {
            this.isAdding = false;
            this.setCanAdd();
        }
    }
}

