/**
 * @module ObjectFields
 */
import {Component, ElementRef, NgZone, OnInit, Renderer2, Injector} from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * field to manage recipients email addresses
 */
@Component({
    templateUrl: '../templates/fieldemailrecipients.html',
    styles: ['input, input:focus { border: none; outline: none;}']
})
export class fieldEmailRecipients extends fieldGeneric implements OnInit {
    /**
     * holds email search results
     */
    public searchResults: any[] = [];
    /**
     * filtered array of emails to be displayed for user
     */
    public displayValue: any[] = [];
    /**
     * hold the show/hide input boolean
     */
    public isInputTextVisible: boolean = false;
    /**
     * hold the is show/hide search boolean
     */
    public isDropdownVisible: boolean = false;
    /**
     * hold the temporary input text value for the email address to be added
     */
    public inputTextValue: string = '';
    /**
     * hold the temporary previous input text value to compare
     */
    public previousInputTextValue: string = '';
    /**
     * holds the timeout for the search key up
     */
    public searchTimeOut: any = undefined;
    /**
     * true when searching for results
     */
    public searchResultsLoading: boolean = false;
    /**
     * true when the input text value does not contain @ and has more than 3 letters
     */
    public searchAllowed: boolean = false;
    /**
     * true if the input text email address is correct
     */
    public isValidEmailAddress: boolean = false;
    /**
     * holds the click listener to remove it later
     */
    public clickListener: any;

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public modal: modal,
                public injector: Injector,
                public backend: backend,
                public renderer: Renderer2,
                public elementRef: ElementRef,
                public zone: NgZone) {
        super(model, view, language, metadata, router);
        this.subscribeToDataChanges();
    }

    /**
     * @return recipient addresses array
     */
    get value() {
        return this.model.getField('recipient_addresses');
    }

    /**
     * set the recipient address array
     * @param val
     */
    set value(val) {
        this.model.setField('recipient_addresses', val);
        this.setDisplayValue();
    }

    /**
     * call to set the initial field value
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setInitialFieldValue();
    }

    /**
     * returns if the model has a parent id
     */
    get hasParent() {
        return !!this.model.getField('parent_id');
    }

    /**
     * search for parent eail addresses
     *
     * @private
     */
    public searchParentEmailAddresses() {
        this.modal.openModal('EmailParentAddressesModal', true, this.injector).subscribe(
            modalRef => {
                modalRef.instance.addAddresses.subscribe(
                    addresses => {
                        for (let address of addresses) {
                            const newEmailAddress = {
                                id: this.model.generateGuid(),
                                address_type: this.fieldconfig.addresstype || 'from',
                                email_address: address.email_address,
                                email_address_id: address.email_address_id,
                                parent_type: address.module,
                                parent_id: address.id
                            };

                            this.value = [...this.model.data.recipient_addresses, newEmailAddress];
                        }
                    }
                );
            }
        );
    }

    /**
     * validate email by regex
     * @param emailAddress
     */
    public validateEmail(emailAddress: string) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.isValidEmailAddress = re.test(String(emailAddress).toLowerCase());
    }

    /**
     * subscribe to model data change and set the value and the display value
     */
    public subscribeToDataChanges() {

        this.subscriptions.add(
            this.model.data$.subscribe(data => {

                if (!data.recipient_addresses || !Array.isArray(data.recipient_addresses)) return;

                if (JSON.stringify(this.value) != JSON.stringify(data.recipient_addresses)) {
                    this.value = data.recipient_addresses;
                }
                if (JSON.stringify(this.displayValue) != JSON.stringify(this.value)) {
                    this.setDisplayValue();
                }
            })
        );
    }

    /**
     * set the initial field value from recipient_addresses
     */
    public setInitialFieldValue() {

        if (!this.model.data.recipient_addresses) {
            this.model.data.recipient_addresses = [];
        }

        this.setDisplayValue();

        // check if any condition si met so no determination shoudl happen on the addresses
        if (this.model.data.recipient_addresses.length > 0 || this.fieldconfig.nodetermination === true || this.fieldconfig.addresstype != 'to' || !this.model.getField('parent_type') || !this.model.getField('parent_id')) return;

        // try to determine addresses from Parent
        this.backend.getRequest(`module/${(this.model.getField('parent_type'))}/${(this.model.getField('parent_id'))}`).subscribe(parent => {

            if (!!parent.email1) {
                this.value = [{
                    parent_type: this.model.getField('parent_type'),
                    parent_id: this.model.getField('parent_id'),
                    email_address: parent.email1,
                    id: this.model.generateGuid(),
                    address_type: 'to'
                }];
            }
        });
    }

    public setDisplayValue() {
        this.displayValue = this.model.data.recipient_addresses
            .filter(address => address.address_type == (this.fieldconfig.addresstype || 'from'));
    }

    /**
     * hide input field on blur
     */
    public onBlur() {
        if (!(!!this.inputTextValue)) this.isInputTextVisible = false;
    }

    /**
     * show input field on focus
     */
    public onFieldClick() {
        this.isInputTextVisible = true;
        this.showDropdown();
    }

    /**
     * remove the email address from the list
     * @param e
     * @param removeId
     */
    public removeEmailAddress(e: MouseEvent, removeId) {

        if (!this.model.data.recipient_addresses || this.model.data.recipient_addresses.length == 0) return;

        this.value = this.model.data.recipient_addresses.filter(addr => addr.id != removeId);

        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * set search allowed boolean
     * validate input text value
     * handle key press to submit or search the email
     * @param event
     */
    public onKeyUp(event) {

        this.searchAllowed = this.inputTextValue.length > 2 && this.inputTextValue.indexOf('@') == -1;
        this.validateEmail(this.inputTextValue);

        if (this.inputTextValue.length < 3) this.hideDropdown();

        switch (event.key) {
            case 'Enter':
            case ',':
                this.searchAllowed = false;
                this.addEmailAddressFromInput();
                break;
            case 'Backspace':
                // check if both the previous and the current input value are empty to remove the last email address
                if (!(!!this.inputTextValue) && !(!!this.previousInputTextValue)) {
                    this.removeLastEmailAddress();
                }
                this.showDropdown();
                this.doSearch();
                break;
            default:
                this.showDropdown();
                this.doSearch();
        }
        this.previousInputTextValue = this.inputTextValue;
    }

    /**
     * remove the last email address when the backspace pressed
     */
    public removeLastEmailAddress() {
        if (!this.value || this.value.length == 0) return;
        this.value = this.model.data.recipient_addresses.slice(0, this.model.data.recipient_addresses.length - 1);
    }

    /**
     * add email to field value
     */
    public addEmailAddressFromInput() {

        if (!this.isValidEmailAddress) return;

        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

        const newEmailAddress = {
            id: this.model.generateGuid(),
            address_type: this.fieldconfig.addresstype || 'from',
            email_address: this.inputTextValue
        };

        this.value = [...this.model.data.recipient_addresses, newEmailAddress];

        this.hideDropdown();
        this.resetInputTextValue();

    }

    /**
     * search for matching email in the database
     */
    public doSearch() {

        if (!this.searchAllowed || this.previousInputTextValue == this.inputTextValue) return;

        this.zone.runOutsideAngular(() => {

            if (this.searchTimeOut) {
                window.clearTimeout(this.searchTimeOut);
            }

            this.searchTimeOut = window.setTimeout(() => {

                if (!!this.inputTextValue) {

                    this.zone.run(() => {
                        this.searchResults = [];
                        this.searchResultsLoading = true;
                    });

                    this.backend.getRequest('module/EmailAddresses/' + this.inputTextValue).subscribe(results => {
                        this.zone.run(() => {
                            if (!!results && results.length > 0) {
                                this.searchResults = results;
                            }
                            this.searchResultsLoading = false;
                        });
                    });
                }
            }, 1000);
        });

    }

    /**
     * push the email address to the field value
     * @param emailAddress
     */
    public selectEmailAddress(emailAddress) {

        const newEmailAddress = {
            id: this.model.generateGuid(),
            address_type: this.fieldconfig.addresstype || 'from',
            email_address: emailAddress.email_address,
            email_address_id: emailAddress.email_address_id,
            parent_type: emailAddress.module,
            parent_id: emailAddress.id
        };

        this.value = [...this.model.data.recipient_addresses, newEmailAddress];

        this.resetInputTextValue();
        this.hideDropdown();
    }

    public resetInputTextValue() {
        this.inputTextValue = '';
        this.previousInputTextValue = '';
    }

    /**
     * handle the document click to check for click outside the search box and hide it
     */
    public addDocumentClickListener() {

        this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {

            if (!this.elementRef.nativeElement.contains(event.target)) {
                this.hideDropdown();
            }
        });
    }

    /**
     * show the search box and add click outside listener
     */
    public showDropdown() {
        if (this.inputTextValue.length < 3) return;
        this.isDropdownVisible = true;
        if (!this.clickListener) this.addDocumentClickListener();
    }

    /**
     * hide the search box and reset
     */
    public hideDropdown() {
        this.isDropdownVisible = false;
        if (!this.inputTextValue || this.inputTextValue.length < 3) {
            this.searchResults = [];
        }
        if (!!this.clickListener) {
            this.clickListener();
            this.clickListener = false;
        }
    }
}
