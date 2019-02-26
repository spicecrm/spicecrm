import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-email-addresses',
    templateUrl: './src/objectfields/templates/fieldemailaddresses.html'
})
export class fieldEmailAddresses extends fieldGeneric implements OnInit {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        if (!this.model.getField('emailaddresses')) {
            this.model.setField(
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
        // get the email addresses
        let emailAddresses = this.model.getField('emailaddresses').filter(emailaddress => emailaddress.email_address != '');

        // get the primary email address
        let email1 = '';
        let primaryEmailAddress = emailAddresses.find(emailaddress => emailaddress.primary_address == '1');
        if(primaryEmailAddress) email1 = primaryEmailAddress.email_address;

        this.model.setFields({emailAddresses, email1});
    }
}

