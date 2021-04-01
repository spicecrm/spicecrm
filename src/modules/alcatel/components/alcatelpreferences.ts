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
 * @module ModuleAsterisk
 */
import {Component, EventEmitter, OnDestroy} from '@angular/core';


import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {modelutilities} from '../../../services/modelutilities.service';
import {Observable, Subject, Subscription} from "rxjs";
import {telephony} from "../../../services/telephony.service";

declare var _: any;

@Component({
    templateUrl: './src/modules/alcatel/templates/alcatelpreferences.html'
})
export class AlcatelPreferences {

    /**
     * reference to self as modal
     */
    private self: any;

    private verifying: boolean = false;

    private saved$: EventEmitter<boolean> = new EventEmitter<boolean>();

    private preferences: any = {
        phoneusername: '',
        username: '',
        userpass: ''
    };

    constructor(private language: language, private backend: backend, private toast: toast) {
        this.getPreferences();
    }

    private close() {
        if(!this.verifying) {
            this.self.destroy();
        }
    }

    /**
     * get the preferences and check if we have a username set
     */
    private getPreferences() {
        this.backend.getRequest('alcatel/preferences').subscribe(prefs => {
            this.preferences.phoneusername = prefs.phoneusername;
            this.preferences.username = prefs.username;
        });
    }

    get canSet() {
        return this.preferences.username && this.preferences.userpass;
    }

    /**
     * set the preferences and test them
     */
    private setPreferences() {
        if (this.canSet) {
            this.verifying = true;
            this.backend.postRequest('alcatel/preferences', {}, this.preferences).subscribe(
                res => {
                    this.verifying = false;
                    if (res.status == 'success') {
                        this.saved$.emit(true);
                        this.close();
                    } else {
                        this.toast.sendToast(this.language.getLabel('MSG_ALCATEL_UNABLE_TO_LOGIN'), 'error');
                    }
                },
                error => {
                    this.verifying = false;
                }
            );
        }
    }


}
