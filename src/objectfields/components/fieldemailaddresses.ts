import {Component} from '@angular/core';
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
export class fieldEmailAddresses extends fieldGeneric {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
    }

    get emailAddresses() {
        return this.model.data[this.fieldname];
    }

    private sendEmail(emailaddress) {
        if (emailaddress.invalid_email !== '1') {
            window.location.assign('mailto:' + emailaddress.email_address);
        }
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
        this.model.data.emailaddresses.push({
            id: this.model.generateGuid(),
            bean_id: this.model.id,
            bean_module: this.model.module,
            email_address: '',
            email_address_id: '',
            primary_address: this.model.data.emailaddresses.length == 0 ? '1' : '0'
        });
    }

    private handleOnBlur() {
        this.model.data.emailaddresses = this.model.data.emailaddresses.filter(emailaddress => emailaddress.email_address != '');
    }
}

