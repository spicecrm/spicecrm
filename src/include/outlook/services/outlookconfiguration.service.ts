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
import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {backend} from "../../../services/backend.service";

declare var Office: any;

/**
 * Outlook add-in configuration service. Used to store login data and save it in the roaming settings.
 */
@Injectable()
export class OutlookConfiguration {
    private settings = Office.context.roamingSettings;

    public username: string;
    public password: string;

    constructor(
        private backend: backend,
    ) {
        this.loadSettings();
    }

    /**
     * Loads the settings from roaming settings.
     */
    public loadSettings() {
        this.username = this.settings.get('username');
        this.password = this.settings.get('password');
    }

    /**
     * Checks if any of the settings are set.
     */
    public hasSettings() {
        return this.username && this.username != '' && this.password && this.password != '';
    }

    /**
     * Saves the settings from the form into roaming settings.
     */
    public saveSettings(): Observable<any> {
        let retSubject = new Subject();

        this.settings.set('username', this.username);
        this.settings.set('password', this.password);

        this.settings.saveAsync(result => {
            if (result.status == Office.AsyncResultStatus.Failed) {
                retSubject.error('failed saving settings');
                retSubject.complete();
            }

            if (result.status == Office.AsyncResultStatus.Succeeded) {
                retSubject.next(true);
                retSubject.complete();
            }
        });

        return retSubject.asObservable();
    }

    /**
     * Tests the login settings against the KREST endpoint.
     */
    public testSettings(): Observable<any> {

        let retSubject = new Subject();

        this.backend.getRequest('login').subscribe(
            (res: any) => {
                // OK
                retSubject.next(true);
                retSubject.complete();
            },
            (err) => {
                retSubject.error(err);
                retSubject.complete();
            }
        );
        return retSubject.asObservable();
    }
}
