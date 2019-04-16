import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {language} from "../../../services/language.service";
import {OutlookConfiguration} from '../services/outlookconfiguration.service';

/**
 * Outlook add-in pane used to gather the login settings.
 */
@Component({
    selector: 'outlook-read-pane-settings',
    templateUrl: './src/include/outlook/templates/outlooksettingspane.html'
})
export class OutlookSettingsPane {
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

    /**
     * Saves the settings in the configuration service.
     */
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

    /**
     * Cancels changes.
     */
    private cancel() {
        this.configuration.loadSettings();
        this.router.navigate(['mailitem']);
    }
}
