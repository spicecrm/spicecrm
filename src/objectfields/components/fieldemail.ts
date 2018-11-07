import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-email',
    templateUrl: './src/objectfields/templates/fieldemail.html'
})
export class fieldEmail extends fieldGeneric {

    private invalid = false;
    private mark: string;

    // from https://emailregex.com
    private validation = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$' );

    constructor(public model: model, public view: view, public l: language, public metadata: metadata, public router: Router) {
        super(model, view, l, metadata, router);
        this.mark = this.model.generateGuid();
    }

    get email() {
        return this.value;  // <--- not needed anymore? :o
    }

    get value(){
        return this.model.getFieldValue(this.fieldname);
    }

    set value(newemail){

        if ( this.invalid && this.validation.test( newemail )) {
            this.model.resetFieldMessages( this.fieldname, 'error', this.mark );
            this.invalid = false;
        }

        this.model.setField(this.fieldname, newemail);
        if (!this.model.getFieldValue('emailaddresses')) {
            return;
        }

        for (let emailaddress of this.model.getFieldValue('emailaddresses')){
            if(emailaddress.primary_address == 1) {
                emailaddress.email_address = newemail;
                emailaddress.email_address_caps = newemail.toUpperCase();
                emailaddress.email_address_id = '';
                emailaddress.id = '';
            }
        }
    }

    private changed() {
        if ( this.value && this.value.length && this.validation.test( this.value )) {
            this.model.resetFieldMessages( this.fieldname, 'error', this.mark );
            this.invalid = false;
        } else {
            this.model.setFieldMessage( 'error', this.l.getLabel('LBL_INPUT_INVALID'), this.fieldname, this.mark );
            this.invalid = true;
        }
    }

    private sendEmail() {
        if (this.model.data[this.fieldname] != '') {
            window.location.assign('mailto:' + this.model.data[this.fieldname]);
        }
    }

}
