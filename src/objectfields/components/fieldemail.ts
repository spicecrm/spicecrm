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

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    get email() {
        return this.value;  // <--- not needed anymore? :o
    }

    get value(){
        return this.model.getFieldValue(this.fieldname);
    }

    set value(newemail){
        this.model.setField(this.fieldname, newemail);
        for(let emailaddress of this.model.getFieldValue('emailaddresses')){
            if(emailaddress.primary_address == 1) {
                emailaddress.email_address = newemail;
                emailaddress.email_address_caps = newemail.toUpperCase();
                emailaddress.email_address_id = '';
                emailaddress.id = '';
            }
        }
    }

    private sendEmail() {
        if (this.model.data[this.fieldname] != '') {
            window.location.assign('mailto:' + this.model.data[this.fieldname]);
        }
    }

}
