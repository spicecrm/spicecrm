/**
 * @module ObjectFields
 */
import {Component, EventEmitter, Host, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {configurationService} from "../../services/configuration.service";
import {backend} from "../../services/backend.service";
import {tap} from "rxjs/operators";
import {fieldEmailAddresses} from "./fieldemailaddresses";

@Component({
    selector: 'field-email-emailaddress',
    templateUrl: '../templates/fieldemailemailaddress.html'
})
export class fieldEmailEmailAddress implements OnChanges
{
    /*
    * emit after typing
    */
    @Output() public onBlur = new EventEmitter<void>();
    /*
    * @input email address data
    */
    @Input() public emailAddress: any = {};
    /*
    * @input has focus flag
    */
    @Input() public hasFocus: boolean = false;
    /**
     * invalid domain boolean
     */
    public invalid_domain: boolean = false;
    /**
     * checking domain flag
     */
    public checkingDomain: boolean = false;
    /**
     * true if the email regex match
     */
    public validInput: boolean = true;

    /**
     * backup the email address input field value
     */
    public backup: string;


    constructor(private backend: backend,
                @Host() private parentCmp: fieldEmailAddresses,
                private configurationService: configurationService) {
    }

    /**
     * @return the email address string
     */
    get emailAddressText() {
        return this.emailAddress.email_address;
    }

    /**
     * set the email address string
     * @param value
     */
    set emailAddressText(value) {

        this.emailAddress.email_address = value;
        this.emailAddress.email_address_caps = value.toUpperCase();
        this.invalid_domain = false;
        this.emailAddress.invalid_email = false;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.emailAddress) {
            this.backup = this.emailAddress.email_address;
        }
    }

    public emitChanges() {

        if (this.backup == this.emailAddress.email_address) return;

        this.parentCmp.setFieldError('checking');
        this.validateEmailAddress();
        this.validateDomain().then((() => this.onBlur.emit()));

    }

    /**
     * validate the email address by regex
     * RFC 5322 regex to validate email address syntax
     * @private
     */
    public validateEmailAddress() {

        let validation = new RegExp('^(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])$');

        if (this.configurationService.data.systemparameters.international_email_addresses) {
            validation = new RegExp('(?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9])?\\.)+[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
        }

        this.validInput = validation.test(this.emailAddress.email_address);
    }

    /**
     * validate email address domain
     */
    private validateDomain(): Promise<boolean> {

        if (!this.emailAddress.email_address || this.emailAddress.invalid_email == 1) return Promise.resolve(true);

        this.checkingDomain = true;

        return new Promise((emitChange) => {
            this.backend.postRequest('module/EmailAddresses/validate', null, {text: this.emailAddress.email_address})
                .subscribe({
                    next: res => {
                        this.checkingDomain = false;
                        this.emailAddress.invalid_email = res.invalid_email || res.invalid_domain ? 1 : 0;
                        this.invalid_domain = res.invalid_domain;
                        this.parentCmp.clearFieldError();

                        emitChange(true);
                    }
                })
        });
    }
}
