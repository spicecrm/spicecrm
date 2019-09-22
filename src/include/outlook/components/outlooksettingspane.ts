/**
 * @module Outlook
 */
import {Component} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {language} from "../../../services/language.service";
import {OutlookConfiguration} from '../services/outlookconfiguration.service';

@Component({
    selector: 'outlook-read-pane-settings',
    templateUrl: './src/include/outlook/templates/outlooksettingspane.html'
})
export class OutlookSettingsPane {
    private submitSettingsString: string = "Save Settings";
    private errormessage: any;
    private isconfigured: boolean;
    private loading: boolean = false;

    constructor(
        private configuration: OutlookConfiguration,
        private router: Router,
        private language: language
    ) {
        this.isconfigured = this.configuration.hasSettings();
    }

    private saveSettings() {
        this.loading = true;
        this.configuration.testSettings().subscribe(
            success => {
                this.configuration.saveSettings().subscribe(
                    success => {
                        this.router.navigate(['mailitem']);
                    },
                    error1 => {
                        this.errormessage = 'error saving settings';
                        this.loading = false;
                    }
                );
            },
            error => {
                this.errormessage = error;
                this.loading = false;
            }
        );
    }

    private cancel() {
        this.configuration.loadSettings();
        this.router.navigate(['mailitem']);
    }
}
