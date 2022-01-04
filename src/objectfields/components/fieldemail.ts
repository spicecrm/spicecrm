/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * display an input field with the primary email address from model
 */
@Component({
    selector: 'field-email',
    templateUrl: '../templates/fieldemail.html'
})
export class fieldEmail extends fieldGeneric {
    /**
     * holds the invalid email value for validation
     */
    public invalid = false;
    /**
     * field message mark guid
     */
    public mark: string;
    // from https://emailregex.com
    public validation = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
        this.mark = this.model.generateGuid();
        /**
         * subscribe to model data change and set the value
         */
        this.subscriptions.add(
            this.model.data$.subscribe(modeldata => {
                if (!this.value || (!!this.value  && this.value != modeldata.email1)) {
                    this.setInitialFieldValue();
                }
            })
        );

        this.model.observeFieldChanges('email_addresses').subscribe(() => {
            this.setInitialFieldValue();
        });

    }

    /**
     * field value
     */
    public _value: string = '';

    /**
     * @return field value
     */
    get value(): string {
        return this._value;
    }

    /**
     * validation the input value and set the field value
     * @param newemail
     */
    set value(newemail: string) {

        this._value = newemail;

        if (newemail && newemail.length > 0 && !this.validation.test(newemail)) {
            this.model.setFieldMessage('error', this.language.getLabel('LBL_INPUT_INVALID'), this.fieldname, this.mark);
            this.invalid = true;
        } else {
            this.model.setField(this.fieldname, newemail || '');
            this.setPrimaryEmail(newemail);
            this.model.resetFieldMessages(this.fieldname, 'error', this.mark);
            this.invalid = false;
        }
    }

    /**
     * get field class
     */
    get fieldClass() {
        return this.invalid ? [...this.css_classes, 'slds-has-error'] : this.css_classes;
    }

    /**
     * set the initial field value from emailaddresses
     */
    public ngOnInit() {
        this.setInitialFieldValue();
        super.ngOnInit();
    }

    /**
     * set the initial field value from emailaddresses
     */
    public setInitialFieldValue() {
        this._value = this.model.getField(this.fieldname);
        const emailAddresses = this.model.getRelatedRecords('email_addresses');
        const email = emailAddresses ? emailAddresses.find(email => email.primary_address == 1) : undefined;
        if(!this._value) {
            this._value = email ? email.email_address : undefined;
        }
    }

    /**
     * set primary email address in emailaddresses
     * @param value
     */
    public setPrimaryEmail(value: string) {

        let newEmail = !!value ? {
            id: this.model.generateGuid(),
            primary_address: '1',
            email_address: value.toLowerCase(),
            email_address_caps: value.toUpperCase()
        } : undefined;

        let emailAddresses = this.model.getRelatedRecords('email_addresses');

        if ((!emailAddresses || emailAddresses.length == 0) && !!newEmail) {
            emailAddresses = [newEmail];
        } else if (!newEmail) {
            emailAddresses = emailAddresses.filter(email => email.primary_address != 1);
        } else {

            let exists = false;

            emailAddresses.forEach(email => {

                if (newEmail.email_address_caps == email.email_address_caps) {
                    exists = true;
                    email.primary_address = 1;
                } else {
                    email.primary_address = 0;
                }
            });

            if (!exists) emailAddresses.push(newEmail);
        }
        this.model.setRelatedRecords('email_addresses', emailAddresses);
    }

    /**
     * navigate to operation system email sender
     */
    public sendEmail(e: MouseEvent) {
        // avoid double opening
        e.stopPropagation();
        e.preventDefault();

        if (this.value.length > 0) {
            window.open('mailto:' + this.value);
        }
    }
}
