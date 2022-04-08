/**
 * @module ObjectFields
 */
import {Component, EventEmitter, Input, NgZone, Output} from '@angular/core';

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

    constructor(public zone: NgZone) {
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
     * @private
     */
    public validateEmailAddress() {
        const validation = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
        this.emailAddress.invalid_email = validation.test(this.emailAddress.email_address) ? 0 : 1;
    }
}
