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
    templateUrl: '../templates/googleapisettings.html'
})
export class GoogleAPISettings implements OnInit {

    public configvalues: any = {};

    /**
     * indicates if the settings are loaded
     *
     * @private
     */
    public loading: boolean = false;

    public serviceuserscope: any = {
        calendar: false,
        gmail_radonly: false,
        gmail_compose: false,
        gmail_modify: false,
        contacts: false
    };

    constructor(
        public language: language,
        public metadata: metadata,
        public backend: backend,
        public modal: modal
    ) {

    }

    /**
     * loads the config on init
     */
    public ngOnInit() {
        this.loading = true;
        this.backend.getRequest('configuration/configurator/editor/googleapi').subscribe(data => {
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
    public save() {
        this.backend.postRequest('configuration/configurator/editor/googleapi', [], { config: this.configvalues });
    }

    /**
     * sets the scope from teh sting
     * @private
     */
    public loadScope() {
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
    public setScope() {
        let scopes = [];

        if (this.serviceuserscope.calendar) scopes.push('https://www.googleapis.com/auth/calendar');
        if (this.serviceuserscope.contacts) scopes.push('https://www.googleapis.com/auth/contacts');
        if (this.serviceuserscope.gmail_radonly) scopes.push('https://www.googleapis.com/auth/gmail.readonly');
        if (this.serviceuserscope.gmail_compose) scopes.push('https://www.googleapis.com/auth/gmail.compose');
        if (this.serviceuserscope.gmail_modify) scopes.push('https://www.googleapis.com/auth/gmail.modify');

        this.configvalues.serviceuserscope = scopes.join(' ');
    }
}
