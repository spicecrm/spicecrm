/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var _;

@Component({
    selector: 'field-email-addresses',
    templateUrl: './src/objectfields/templates/fieldemailaddresses.html'
})
export class fieldEmailAddresses extends fieldGeneric implements OnInit {
    /**
     * holds the input radio unique name for the primary radio button
     */
    public primaryInputRadioName: string =  _.uniqueId('field-email-address-');

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        if (!this.model.getField('emailaddresses')) {
            this.model.initializeField(
                'emailaddresses',
                [{
                    id: this.model.generateGuid(),
                    bean_id: this.model.id,
                    bean_module: this.model.module,
                    email_address: '',
                    email_address_id: '',
                    primary_address: '1'
                }]
            );
        }
    }

    get emailAddresses() {
        return this.model.getField(this.fieldname);
    }

    private sendEmail(emailaddress) {
        if (emailaddress.invalid_email !== '1') {
            window.location.assign('mailto:' + emailaddress.email_address);
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private setprimary(id) {
        for (let emailaddress of this.model.data.emailaddresses) {
            if (emailaddress.id == id) {
                emailaddress.primary_address = "1";
            } else {
                emailaddress.primary_address = "0";
            }
        }
    }

    private addEmailAddress() {
        this.model.getField('emailaddresses').push({
            id: this.model.generateGuid(),
            bean_id: this.model.id,
            bean_module: this.model.module,
            email_address: '',
            email_address_id: '',
            primary_address: '0'
        });
    }

    private handleOnBlur() {
        let emailAddresses = [];
        // get the email addresses
        this.model.getField('emailaddresses')
            .filter(emailAddress => emailAddress.email_address != '')
            .forEach(emailAddress => {
                if (!emailAddresses.some(e => e.email_address == emailAddress.email_address)) emailAddresses.push(emailAddress);
            });

        // get the primary email address
        let primaryEmailAddress = emailAddresses.find(emailAddress => emailAddress.primary_address == '1');
        // if no primary was set take the first entry
        if (!primaryEmailAddress && emailAddresses.length > 0) {
            emailAddresses[0].primary_address = '1';
            primaryEmailAddress = emailAddresses[0];
        }

        this.model.setFields({
            emailaddresses: emailAddresses,
            email1: primaryEmailAddress.email_address
        });
    }
}

