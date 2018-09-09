import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-email-addresses',
    templateUrl: './src/objectfields/templates/fieldemailaddresses.html'
})
export class fieldEmailAddresses extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get email() {
        return this.model.data[this.fieldname];
    }

    sendEmail() {
        if (this.model.data[this.fieldname] != '') {
            window.location.assign('mailto:' + this.model.data[this.fieldname]);
        }
    }

    setprimary(id) {
        for (let emailaddress of this.model.data.emailaddresses) {
            if (emailaddress.id == id)
                emailaddress.primary_address = 1
            else
                emailaddress.primary_address = 0

        }
    }

}
