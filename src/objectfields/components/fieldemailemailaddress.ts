/**
 * @module ObjectFields
 */
import {Component, EventEmitter, Input, NgZone, Output} from '@angular/core';
import {configurationService} from "../../services/configuration.service";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'field-email-emailaddress',
    templateUrl: '../templates/fieldemailemailaddress.html'
})
export class fieldEmailEmailAddress {
    /*
    * emit after typing
    */
    @Output() public onBlur = new EventEmitter<void>();
    /*
    * @input email address data
    */
    @Input() public emailAddress: any = {};
    /**
     * holds the typing timeout
     * @private
     */
    public typingTimeout: number;
    /**
     * invalid domain boolean
     */
    public invalid_domain: boolean = false;
    /**
     * checking domain flag
     */
    public checkingDomain: boolean = false;

    constructor(public zone: NgZone,
                private backend: backend,
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

        this.zone.runOutsideAngular(() => {
            window.clearTimeout(this.typingTimeout);
            this.typingTimeout = window.setTimeout(() =>
                    this.zone.run(() => {
                        this.validateEmailAddress();
                        this.onBlur.emit();
                    })
                ,
                500
            );
        });
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

        this.emailAddress.invalid_email = validation.test(this.emailAddress.email_address) ? 0 : 1;
    }

    /**
     * validate email address domain
     */
    public validateDomain() {

        if (!this.emailAddress.email_address || this.emailAddress.invalid_email == 1) return;

        this.checkingDomain = true;

        this.backend.postRequest('module/EmailAddresses/validate', null, {text: this.emailAddress.email_address})
            .subscribe(res => {
                this.checkingDomain = false;
                this.emailAddress.invalid_email = res.invalid_email || res.invalid_domain ? 1 : 0;
                this.invalid_domain = res.invalid_domain;
            });
    }
}
