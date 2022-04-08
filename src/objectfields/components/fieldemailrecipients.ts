/**
 * @module ObjectFields
 */
import {Component, ElementRef, Injector, NgZone, OnInit, Renderer2} from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

/**
 * field to manage recipients email addresses
 */
@Component({
    selector: 'field-email-recipients',
    templateUrl: '../templates/fieldemailrecipients.html'
})
export class fieldEmailRecipients extends fieldGeneric implements OnInit {
    /**
     * filtered array of emails to be displayed for user
     */
    public displayValue: any[] = [];
    /**
     * show/hide cc input
     */
    public showCCField: boolean = false;
    /**
     * show/hide bcc input
     */
    public showBCCField: boolean = false;
    /**
     * hold field focused value
     */
    public focused: boolean = false;
    /**
     * cdk dragging indicator
     */
    public dragging: boolean = false;
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
     * call to set the initial field value
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setInitialFieldValue();
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

        if (!this.model.getField('recipient_addresses')) {
            this.model.setField('recipient_addresses', []);
        }

        this.setDisplayValue();

        // check if any condition si met so no determination shoudl happen on the addresses
        if (this.model.getField('recipient_addresses').length > 0 || this.fieldconfig.nodetermination === true || this.fieldconfig.addresstype != 'to' || !this.model.getField('parent_type') || !this.model.getField('parent_id')) return;

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

    /**
     * set the display value
     */
    public setDisplayValue() {
        this.displayValue = this.model.getField('recipient_addresses')
            .filter(address => {
                if(address.address_type == 'cc') {
                    this.showCCField = true;
                }
                if(address.address_type == 'bcc') {
                    this.showBCCField = true;
                }
                return this.fieldconfig.addresstype == 'to' ? ['to', 'cc', 'bcc'].indexOf(address.address_type) > -1 : address.address_type == (this.fieldconfig.addresstype || 'from');

            });
    }

    /**
     * show other recipient field
     * @param field
     * @param event
     */
    public showField(field: 'cc' | 'bcc', event: MouseEvent) {

        event.stopPropagation();

        if (field == 'cc') {
            this.showCCField = true;
        } else {
            this.showBCCField = true;
        }

        this.setFocused();
    }

    /**
     * handle the document click to check for click outside the search box and hide it
     */
    public addDocumentClickListener() {

        this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {

            if (!this.elementRef.nativeElement.contains(event.target)) {
                this.setDisplayValue();
                this.focused = false;
                this.clickListener();
                this.clickListener = undefined;
            }
        });
    }

    /**
     * set focused boolean
     */
    public setFocused() {
        this.setDisplayValue();
        this.focused = true;
        if (!this.clickListener) this.addDocumentClickListener();

    }

    /**
     * handle drop move address between types
      * @param event
     */
    public handleDrop(event: CdkDragDrop<any>) {

        const previousIndex = this.value.findIndex(v => v == event.item.data);

        if (event.previousContainer.data != event.container.data) {
            this.value.some(addr => {
                if (event.item.data == addr) {
                    addr.address_type = event.container.data;
                    return true;
                }
            });
        }

        moveItemInArray(this.value, previousIndex, event.currentIndex);

        this.setDisplayValue();
    }
}
