/**
 * @module ObjectFields
 */
import {ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';

import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {configurationService} from '../../../services/configuration.service';
import {backend} from "../../../services/backend.service";
import {userpreferences} from "../../../services/userpreferences.service";

import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

declare var _: any;

/**
 * list all available mailboxes
 */
@Component({
    templateUrl: '../templates/fieldmailboxes.html',
    selector: 'field-mailboxes',
})
export class fieldMailboxes extends fieldGeneric implements OnInit {
    /**
     * the available mailboxes
     */
    public options: any[] = [];

    /**
     * config for zip compress
     */
    public mailboxZipConfig: string;

    /**
     * config for send read receipt
     */
    public mailboxReadReceiptConfig: string;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public backend: backend,
        public configuration: configurationService,
        public userpreferences: userpreferences,
        public cdRef: ChangeDetectorRef
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * getter for the value
     */
    get value() {
        return this.model.getField(this.fieldname);
    }

    /**
     * overrides the setter and stores the value also in the preferences
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val);
    }

    /**
     * returns the scope for the mailbox field from teh config
     */
    get scope() {
        return this.fieldconfig.scope ? this.fieldconfig.scope : 'outboundsingle';
    }

    /**
     * returns the css classes
     */
    public getFieldClass() {
        if (this.receiptHidden && this.zipHidden) this.addCssClass('slds-size--1-of-1');
        else if(!this.zipHidden && !this.receiptHidden) this.addCssClass('slds-size--2-of-4');
        else{this.addCssClass('slds-size--3-of-4'); }
        return this.css_classes;
    }

    /**
     * set the value from the user preferences
     * get the options
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setValueFromPreferences();
        this.getOptions();
        this.setConfigSettings(this.value);
    }

    /**
     * gets the mailbox options for the select
     */
    public getOptions() {

        const options = this.configuration.getData(`mailboxes${this.scope}`);

        if (_.isEmpty(options)) {
            this.backend.getRequest("module/Mailboxes/scope", {scope: this.scope}).subscribe(
                (results: any) => {

                    this.options = results.sort((a, b) => a.display.localeCompare(b.display));

                    // cache the options
                    this.configuration.setData(`mailboxes${this.scope}`, this.options);

                    this.cdRef.detectChanges();
                });
        } else {
            this.options = options;
        }
    }

    /**
     * defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.value
     */
    public trackByFn(index, item) {
        return item.value;
    }

    /**
     * loads teh default value from the preferences and sets it
     * @private
     */
    public setValueFromPreferences() {

        if (!!this.value || !!this.fieldconfig.disableCache) return;

        const fromPreferences = this.userpreferences.getPreference(`defaultmailbox_${this.scope}`);
        if (fromPreferences && this.isEditMode()) this.model.setField(this.fieldname, fromPreferences);

        this.subscriptions.add(
            this.model.mode$.subscribe(mode => {
                if (mode != 'edit' || !!this.value) return;
                const fromPreferences = this.userpreferences.getPreference(`defaultmailbox_${this.scope}`);
                if (fromPreferences) this.model.setField(this.fieldname, fromPreferences);
            })
        );
    }

    /**
     * set the value to the preferences as default mailbox
     * @param value
     * @private
     */
    public setToPreferences(value: string) {

        if (!!this.fieldconfig.disableCache) return;

        this.userpreferences.setPreference(`defaultmailbox_${this.scope}`, value);
    }

    /**
     * react to changes in the chosen mailbox
     * @param value
     */
    public onChange(value){
        this.setConfigSettings(value);
        this.setZip(undefined);
        this.setReadReceipt(undefined);
        this.setToPreferences(value);
    }

    /**
     * get config to disable zip compress checkbox
     */
    get zipDisabled() {
        return !this.mailboxZipConfig || this.mailboxZipConfig == '0';
    }

    /**
     * get config to disable send read receipt checkbox
     */
    get receiptDisabled() {
        return !this.mailboxZipConfig || this.mailboxReadReceiptConfig == '0';
    }

    /**
     * get config to hide zip compress checkbox
     */
    get zipHidden() {
        return this.fieldconfig.hideZipCompress;
    }

    /**
     * get config to hide send read receipt checkbox
     */
    get receiptHidden() {
        return this.fieldconfig.hideReadReceipt;
    }

    /**
     * get congig for specific mailbox if zip compress and send read receipt are enabled
     * @param mailboxId
     * @private
     */
    private setConfigSettings(mailboxId: string) {
        if (!!mailboxId) {
            let mailboxData = this.configuration.getData(`mailboxes${this.scope}`);
            if (!mailboxData) {
                this.backend.getRequest("module/Mailboxes/scope", {scope: this.scope}).subscribe(
                    (results: any) => {
                        this.options = results.sort((a, b) => a.display.localeCompare(b.display));
                        this.mailboxZipConfig = this.options.find(id => id.value == mailboxId).zip_compress;
                        this.mailboxReadReceiptConfig = this.options.find(id => id.value == mailboxId).send_read_receipt;
                    })
            } else {
                const selectedMailboxData = this.configuration.getData(`mailboxes${this.scope}`).find(id => id.value == mailboxId);
                this.mailboxZipConfig = selectedMailboxData.zip_compress;
                this.mailboxReadReceiptConfig = selectedMailboxData.send_read_receipt;
            }
        }
    }

    /**
     * set zip compress value
     * @param value
     */
    public setZip(value) {
        this.model.setField('zip_compress', value);
    }

    /**
     * set send read receipt value
     * @param value
     */
    public setReadReceipt(value){
        this.model.setField('send_read_receipt', value);
    }
}
