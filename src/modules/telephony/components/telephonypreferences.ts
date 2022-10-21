/**
 * @module ModuleAsterisk
 */
import {Component, EventEmitter} from '@angular/core';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: '../templates/telephonypreferences.html'
})
export class TelephonyPreferences {

    /**
     * reference to self as modal
     */
    public self: any;

    public verifying: boolean = false;

    public saved$: EventEmitter<boolean> = new EventEmitter<boolean>();

    public preferences: any = {
        username: '',
        userpass: ''
    };

    constructor(public language: language, public backend: backend, public toast: toast) {
        this.getPreferences();
    }

    get canSet() {
        return this.preferences.username && this.preferences.userpass;
    }

    public close() {
        if (!this.verifying) {
            this.self.destroy();
        }
    }

    /**
     * get the preferences and check if we have a username set
     */
    public getPreferences() {
        this.backend.getRequest('channels/voice/StarFaceVOIP/preferences').subscribe(prefs => {
            this.preferences.username = prefs.username;
        });
    }

    /**
     * set the preferences and test them
     */
    public setPreferences() {
        if (this.canSet) {
            this.verifying = true;
            this.backend.postRequest('channels/voice/StarFaceVOIP/preferences', {}, this.preferences).subscribe(
                res => {
                    this.verifying = false;
                    if (res.status == 'success') {
                        this.saved$.emit(true);
                        this.close();
                    } else {
                        this.toast.sendToast(this.language.getLabel('MSG_STARFACE_UNABLE_TO_LOGIN'), 'error');
                    }
                },
                error => {
                    this.verifying = false;
                }
            );
        }
    }
}
