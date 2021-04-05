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
 * @module ModuleGoogleAPI
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * renders a dialog to manage the settings for the Google API
 */
@Component({
    templateUrl: './src/modules/googleapi/templates/googleapisettings.html'
})
export class GoogleAPISettings implements OnInit {

    private configvalues: any = {};

    /**
     * indicates if the settings are loaded
     *
     * @private
     */
    private loading: boolean = false;

    private serviceuserscope: any = {
        calendar: false,
        gmail_radonly: false,
        gmail_compose: false,
        gmail_modify: false,
        contacts: false
    };

    constructor(
        private language: language,
        private metadata: metadata,
        private backend: backend,
        private modal: modal
    ) {

    }

    /**
     * loads the config on init
     */
    public ngOnInit() {
        this.loading = true;
        this.backend.getRequest('configurator/editor/googleapi').subscribe(data => {
            this.configvalues = data;
            this.loadScope();
            this.loading = false;
        });
    }

    /**
     * save the values
     *
     * @private
     */
    private save() {
        this.backend.postRequest('configurator/editor/googleapi', [], this.configvalues);
    }

    /**
     * sets the scope from teh sting
     * @private
     */
    private loadScope() {
        let scopes = [];
        if(this.configvalues.hasOwnProperty('serviceuserscope')) {
            scopes = this.configvalues.serviceuserscope.split(' ');
        }
        for (let scope of scopes) {
            switch (scope) {
                case 'https://www.googleapis.com/auth/calendar':
                    this.serviceuserscope.calendar = true;
                    break;
                case 'https://www.googleapis.com/auth/contacts':
                    this.serviceuserscope.contacts = true;
                    break;
                case 'https://www.googleapis.com/auth/gmail.readonly':
                    this.serviceuserscope.gmail_radonly = true;
                    break;
                case 'https://www.googleapis.com/auth/gmail.compose':
                    this.serviceuserscope.gmail_compose = true;
                    break;
                case 'https://www.googleapis.com/auth/gmail.modify':
                    this.serviceuserscope.gmail_modify = true;
                    break;
            }
        }
    }

    /**
     * builds the scopes striung from the settings object
     *
     * @private
     */
    private setScope() {
        let scopes = [];

        if (this.serviceuserscope.calendar) scopes.push('https://www.googleapis.com/auth/calendar');
        if (this.serviceuserscope.contacts) scopes.push('https://www.googleapis.com/auth/contacts');
        if (this.serviceuserscope.gmail_radonly) scopes.push('https://www.googleapis.com/auth/gmail.readonly');
        if (this.serviceuserscope.gmail_compose) scopes.push('https://www.googleapis.com/auth/gmail.compose');
        if (this.serviceuserscope.gmail_modify) scopes.push('https://www.googleapis.com/auth/gmail.modify');

        this.configvalues.serviceuserscope = scopes.join(' ');
    }
}
