/**
 * @module ObjectFields
 */
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'field-email-emailaddress',
    templateUrl: './src/objectfields/templates/fieldemailemailaddress.html'
})
export class fieldEmailEmailAddress {
    /*
    * @output primaryaddress: EventEmitter: boolean
    */
    @Output() public primaryaddress: EventEmitter<boolean> = new EventEmitter<boolean>();
    /*
    * @output onBlur: EventEmitter: boolean
    */
    @Output() public onBlur: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('inputText', {static: false}) private inputText: ElementRef;
    /*
    * @input emailaddress: object
    */
    @Input() private emailaddress: any = {};

    constructor(public language: language) {

    }

    /*
    * @return emailadr: string
    */
    get emailadr() {
        return this.emailaddress.email_address;
    }

    /*
    * @param emailaddress: string
    * @set email_address: string
    * @set email_address_caps: string
    */
    set emailadr(emailaddress) {
        this.emailaddress.email_address = emailaddress;
        this.emailaddress.email_address_caps = emailaddress.toUpperCase();
    }

    /*
    * @return primary_address: '1' | '0'
    */
    get primary() {
        return this.emailaddress.primary_address;
    }

    /*
    * @param value: string
    * @set primary_address
    * @emit boolean by primaryaddress
    * @emit void by onBlur
    */
    set primary(value) {
        if (this.emailaddress.invalid_email != 1 && this.emailaddress.email_address != '') {
            this.emailaddress.primary_address = '1';
            this.primaryaddress.emit(true);
        }
        this.onBlur.emit();
    }

    /*
    * @return opt_out: boolean
    */
    get opt_out() {
        return this.emailaddress.opt_out == 1;
    }

    /*
    * @set opt_out: 1 | 0
    */
    set opt_out(value) {
        if (this.emailaddress.invalid_email != 1) {
            this.emailaddress.opt_out = value ? 1 : 0;
        }
    }

    /*
    * @return invalid_email: boolean
    */
    get invalid_email() {
        return this.emailaddress.invalid_email == 1;
    }
}
