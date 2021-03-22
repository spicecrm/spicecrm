/**
 * @module ObjectFields
 */
import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
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
    templateUrl: './src/modules/mailboxes/templates/fieldmailboxes.html'
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
        private backend: backend,
        private configuration: configurationService,
        private userpreferences: userpreferences,
        private cdRef: ChangeDetectorRef
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * overrides the setter and stores the value also in the preferences
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val);

        this.userpreferences.setPreference(`defaultmailbox_${this.scope}`, val);
    }

    /**
     * getter for the value
     */
    get value() {
        return this.model.getField(this.fieldname);
    }

    /**
     * returns the scope for the mailbox field from teh config
     */
    get scope() {
        return this.fieldconfig.scope ? this.fieldconfig.scope : 'outboundsingle';
    }

    /**
     * sets the field to disabled if no options are available
     */
    get isDisabled() {
        return this.options.length == 0;
    }

    public ngOnInit() {
        super.ngOnInit();

        // load the default value
        this.getDefaultValue();

        // get the mailboxes  / Options
        this.getOptions();
    }

    /**
     * returns the value from the options array that matches the id for the display
     */
    get displayValue() {
        return this.options.find(m => m.value == this.value);
    }

    /**
     * gets the mailbox options for the select
     */
    public getOptions() {
        let options = this.configuration.getData(`mailboxes${this.scope}`);
        if (_.isEmpty(options)) {
            this.backend.getRequest("module/Mailboxes", {scope: this.scope}).subscribe(
                (results: any) => {
                    // sort the options
                    this.options = results.sort((a, b) => a.display.localeCompare(b.display));

                    // check the value
                    this.checkSetValue();
                    if (this.options.length > 0 && !this.value) {
                        this.model.setField(this.fieldname, this.options[0].value);
                    }

                    // set to config
                    this.configuration.setData(`mailboxes${this.scope}`, this.options);

                    this.cdRef.detectChanges();
                });
        } else {
            this.options = options;

            // check the value
            this.checkSetValue();
        }
    }

    /**
     * checks if a set value i in the options .. to be called after the options ahev beenset or changed
     *
     * @private
     */
    private checkSetValue() {
        // check that if we have a default value it is still in the options
        if (this.value && !this.options.find(m => m.value == this.value)) {
            // this.value = '';
        }
    }

    /**
     * loads teh default value from the preferences and sets it
     * @private
     */
    private getDefaultValue() {
        let defaultvalue = this.userpreferences.getPreference(`defaultmailbox_${this.scope}`);
        if (defaultvalue) this.model.setField(this.fieldname, defaultvalue);
    }

}
