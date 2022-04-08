/**
 * @module ObjectFields
 */
import {Component, Renderer2, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    templateUrl: '../templates/fieldemailrecipientsshort.html',
    styles: ['input, input:focus { border: none; outline: none;}']
})
export class fieldEmailRecipientsShort extends fieldGeneric {

    isAdding: boolean = false;
    addAddress: string = '';
    searchTimeOut: any = undefined;
    showSearchResults: boolean = false;
    searchResults: any[] = [];
    searchResultsLoading: boolean = false;
    clickListener: any;

    @ViewChild('addAddressInput', {read: ViewContainerRef, static: true}) addAddressInput: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public backend: backend, public renderer: Renderer2, public elementRef: ElementRef) {
        super(model, view, language, metadata, router);
    }

    get firstAddress() {
        return this.addrArray && this.addrArray.length > 0 ? this.addrArray[0].email_address : '';
    }

    get addresstype() {
        return this.fieldconfig.addresstype ? this.fieldconfig.addresstype : 'from';
    }

    get addrArray() {
        let addressArray = [];
        if (this.model.getField('recipient_addresses')) {
            for (let recipient_addresse of this.model.getField('recipient_addresses')) {
                if (recipient_addresse.address_type == this.addresstype && recipient_addresse.deleted != '1') {
                    addressArray.push(recipient_addresse);
                }
            }
        }
        return addressArray;
    }

    public onClick() {
        this.isAdding = true;
    }

    public onBlur() {
        if (this.addAddress == '') {
            this.isAdding = false;
        }
    }

    public removeAddress(e, removeid) {
        // stop the event here
        e.preventDefault();
        e.stopPropagation();

        // handle the deletion
        for (let address of this.model.getField('recipient_addresses')) {
            if (address.id == removeid) {
                address.deleted = '1';
                return;
            }
        }
    }

    public onKeyUp(event) {
        // handle the key pressed
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                // clear timeout if one is set
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                // if the atring is an email address add it .. else do search
                if (this.validateEmail(this.addAddress)) {
                    if (!this.model.getField('recipient_addresses')) {
                        this.model.setField('recipient_addresses', []);
                    }

                    this.model.getField('recipient_addresses').push({
                        id: this.model.generateGuid(),
                        address_type: this.addresstype,
                        email_address: this.addAddress
                    })

                    // clear the address string, the resuklts and hide the show dialog
                    this.addAddress = '';
                    this.closeSearchDialog();


                } else {
                    this.doSearch();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    closeSearchDialog() {
        // close the cliklistener sine the component is gone
        this.clickListener();
        this.searchResults = [];
        this.showSearchResults = false;
    }

    public doSearch() {
        if (this.addAddress !== '') {
            this.searchResults = [];
            this.showSearchResults = true;
            this.searchResultsLoading = true;

            this.clickListener = this.renderer.listen('document', 'click', (event) => this.handleClick(event));

            this.backend.getRequest('module/EmailAddresses/' + this.addAddress).subscribe(results => {
                if (results.length > 0) {
                    this.searchResults = results;
                } else {
                    this.closeSearchDialog();
                }

                this.searchResultsLoading = false;
            });
        }
    }

    public handleClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closeSearchDialog();
            this.addAddress = '';
            this.isAdding = false;
        }
    }

    public selectAddress(address) {

        if (!this.model.getField('recipient_addresses')) {
            this.model.setField('recipient_addresses', []);
        }

        this.model.getField('recipient_addresses').push({
            id: this.model.generateGuid(),
            address_type: this.addresstype,
            email_address: address.email_address,
            email_address_id: address.email_address_id,
            parent_type: address.module,
            parent_id: address.id
        })
        // lear the search sting
        this.addAddress = '';

        // hid teh input box
        this.isAdding = false;

        // close the search dropdown
        this.closeSearchDialog()
    }

    public validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


}
