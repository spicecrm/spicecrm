/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module Outlook
 */
import {Component} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';

import {language} from "../../../services/language.service";
import {OutlookConfiguration} from '../services/outlookconfiguration.service';

/**
 * A settings component for the SpiceCRM Outlook add-in.
 */
@Component({
    selector: 'outlook-read-pane-settings',
    templateUrl: './src/include/outlook/templates/outlooksettingspane.html'
})
export class OutlookSettingsPane {
    private submitSettingsString: string = "Save Settings";
    /**
     * Error message.
     */
    private errormessage: any;
    /**
     * Is the add-in already configured.
     */
    private isconfigured: boolean;
    /**
     * A loading indicator.
     */
    private loading: boolean = false;

    constructor(
        private configuration: OutlookConfiguration,
        private router: Router,
        private language: language
    ) {
        this.isconfigured = this.configuration.hasSettings();
    }

    /**
     * Saves the settings.
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
     * Cancels out of the setting container.
     */
    private cancel() {
        this.configuration.loadSettings();
        this.router.navigate(['mailitem']);
    }
}
