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
 * @module GlobalComponents
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';


/**
 * renders a password change dialog when the user logs in and is required to change the password
 */
@Component({
    selector: 'global-login-reset-password',
    templateUrl: './src/globalcomponents/templates/globalloginresetpassword.html',
    host: {
        '(window:keyup)': 'this.keypressed($event)'
    }
})
export class GlobalLoginResetPassword {
    /**
     * the old password to check that the password has been changed
     * @private
     */
    @Input('oldpassword') private oldPassword: string;

    /**
     * emits if the prompt should be closed again
     *
     * @private
     */
    @Output() private closeRenewDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the entered password
     * @private
     */
    private password: string;

    /**
     * the repeated password
     * @private
     */
    private repeatPassword: string;

    /**
     * the regex to match the password requirements
     * @private
     */
    private pwdCheck: RegExp = new RegExp('//');

    /**
     * the text for the password requriements
     * @private
     */
    private pwdGuideline: string;

    /**
     * if we are psoting the password
     * @private
     */
    private posting: boolean = false;


    constructor(private loginService: loginService,
                private http: HttpClient,
                private configuration: configurationService,
                private toast: toast,
                private session: session,
                private language: language
    ) {
        this.getInfo();
    }

    /**
     * checks that the new assowrd is different than the old
     */
    get oldPwError() {
        return (this.oldPassword == this.password) ? 'Old password is not allowed to be used as a new password' : false;
    }

    /**
     * check that the password matches the requirements
     */
    get pwderror() {
        return this.password && !this.pwdCheck.test(this.password) ? 'Password does not match the Guideline.' : false;
    }

    /**
     * checks that the new password has been typed correctly
     */
    get pwdreperror() {
        return this.password == this.repeatPassword ? false : 'Inputs for the new Password does not match.'; // does not match password
    }

    /**
     * closes the dialog
     *
     * @private
     */
    private closeDialog() {
        this.closeRenewDialog.emit(true);
    }

    /*
    * handle change on enter and escape press
    */
    private keypressed(event) {
        if (event.key === 'Enter') {
            this.sendNewPass();
        }
        if (event.key === 'Escape') {
            this.closeDialog();
        }
    }

    /*
    * retrieve password guideline
    */
    private getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];
        if (extConf.onelower) requArray.push('one lower case');
        if (extConf.oneupper) requArray.push('one upper case');
        if (extConf.onenumber) requArray.push('one number');
        if (extConf.minpwdlength) requArray.push('minimum length ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

    /**
     * checks if the password can be saved
     */
    get canSave() {
        return this.password && this.oldPwError == false && this.pwderror == false && this.pwdreperror == false && !this.posting;
    }

    /*
    * change the password for the user
    */
    private sendNewPass() {

        if (this.canSave) {

            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', this.session.authData.sessionId);

            this.posting = true;
            this.http.post(this.configuration.getBackendUrl() + '/resetTempPass', {
                password: this.password,
            }, {headers: headers}).subscribe(
                (res) => {
                    this.toast.sendToast('Password was successfully changed', 'success', '', 5);
                    this.loginService.load();
                },
                (err: any) => {
                    this.posting = false;
                });
        }
    }
}
