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
    private save() {
        this.backend.postRequest('configuration/configurator/editor/googleapi', [], { config: this.configvalues });
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
