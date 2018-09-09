import {Component, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';


@Component({
    selector: 'field-email-emailaddress',
    templateUrl: './app/objectfields/templates/fieldemailemailaddress.html'
})
export class fieldEmailEmailAddress  {

    @Input() emailaddress: any = {};
    @Output() primaryaddress : EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public language: language) {

    }

    get emailadr(){
        return this.emailaddress.email_address;
    }

    set emailadr(emailaddress){
        this.emailaddress.email_address = emailaddress;
        this.emailaddress.email_address_caps = emailaddress.toUpperCase();
    }

    get primary(){
        return this.emailaddress.primary_address == '1' ? true : false;
    }

    set primary(value){
        this.emailaddress.primary_address = '1';
        this.primaryaddress.emit(true);
    }

    get opt_out(){
        return this.emailaddress.opt_out == 1 ? true : false;
    }

    set opt_out(value){
        this.emailaddress.opt_out =value ? 1 : 0;
    }


    get invalid_email(){
        return this.emailaddress.invalid_email == 1 ? true : false;
    }

    set invalid_email(value){
        this.emailaddress.invalid_email =value ? 1 : 0;
    }

}
