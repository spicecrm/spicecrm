/**
 * @module ObjectFields
 */
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
    templateUrl: '../templates/fieldmailboxes.html'
})
export class fieldMailboxes extends fieldGeneric implements OnInit {
    /**
     * the available mailboxes
     */
    public options: any[] = [];

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
     * set the value from the user preferences
     * get the options
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setValueFromPreferences();
        this.getOptions();
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

                    if (this.options.length > 0 && !this.value) {
                        this.model.setField(this.fieldname, this.options[0].value);
                    }

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
        if (fromPreferences) this.model.setField(this.fieldname, fromPreferences);
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
}
