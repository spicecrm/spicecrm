/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
            this.backend.getRequest("mailboxes/getmailboxes", {scope: this.scope}).subscribe(
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
