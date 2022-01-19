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
    templateUrl: '../templates/alcatelpreferences.html'
})
export class AlcatelPreferences {

    /**
     * reference to self as modal
     */
    public self: any;

    public verifying: boolean = false;

    public saved$: EventEmitter<boolean> = new EventEmitter<boolean>();

    public preferences: any = {
        phoneusername: '',
        username: '',
        userpass: ''
    };

    constructor(public language: language, public backend: backend, public toast: toast) {
        this.getPreferences();
    }

    public close() {
        if(!this.verifying) {
            this.self.destroy();
        }
    }

    /**
     * get the preferences and check if we have a username set
     */
    public getPreferences() {
        this.backend.getRequest('channels/voice/alcatel/preferences').subscribe(prefs => {
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
    public setPreferences() {
        if (this.canSet) {
            this.verifying = true;
            this.backend.postRequest('channels/voice/alcatel/preferences', {}, this.preferences).subscribe(
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
