/**
 * @module ObjectFields
 */
import {Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'field-email-emailaddress',
    templateUrl: './src/objectfields/templates/fieldemailemailaddress.html'
})
export class fieldEmailEmailAddress  {
    @ViewChild('inputText', {static: false}) private inputText: ElementRef;

    @Input() private emailaddress: any = {};
    @Output() public primaryaddress: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() public onBlur: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public language: language) {

    }

    public ngAfterViewInit() {
        if (this.emailaddress.email_address == '') {
            this.inputText.nativeElement.focus();
        }
    }

    get emailadr() {
        return this.emailaddress.email_address;
    }

    set emailadr(emailaddress){
        this.emailaddress.email_address = emailaddress;
        this.emailaddress.email_address_caps = emailaddress.toUpperCase();
    }

    get primary(){
        return this.emailaddress.primary_address == '1';
    }

    set primary(value){
        if (this.emailaddress.invalid_email != 1 && this.emailaddress.email_address != '') {
            this.emailaddress.primary_address = '1';
            this.primaryaddress.emit(true);
        }
    }

    get opt_out() {
        return this.emailaddress.opt_out == 1;
    }

    set opt_out(value){
        if (this.emailaddress.invalid_email != 1) {
            this.emailaddress.opt_out = value ? 1 : 0;
        }
    }


    get invalid_email(){
        return this.emailaddress.invalid_email == 1;
    }

    set invalid_email(value){
        this.emailaddress.invalid_email = value ? 1 : 0;
    }
}
