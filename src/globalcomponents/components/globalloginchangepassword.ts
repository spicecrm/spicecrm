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
    selector: 'global-login-change-password',
    templateUrl: './src/globalcomponents/templates/globalloginchangepassword.html'
})
export class GlobalLoginChangePassword {
    /**
     * the old password to check that the password has been changed
     * @private
     */
    @Input('password') private password: string;

    /**
     * the id ot the user that tried to log in but has an expired password
     * @private
     */
    @Input('username') private username: string;

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
    private newPassword: string;

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
        return (this.password == this.newPassword) ? 'Old password is not allowed to be used as a new password' : false;
    }

    /**
     * check that the password matches the requirements
     */
    get pwderror() {
        return this.newPassword && !this.pwdCheck.test(this.newPassword) ? 'Password does not match the Guideline.' : false;
    }

    /**
     * checks that the new password has been typed correctly
     */
    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : 'Inputs for the new Password does not match.'; // does not match password
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
        return this.newPassword && this.oldPwError == false && this.pwderror == false && this.pwdreperror == false && !this.posting;
    }

    /*
    * change the password for the user
    * send an unauthenticated request to the backend
    */
    private setPassword() {
        if (this.canSave) {
            this.posting = true;
            this.http.post(this.configuration.getBackendUrl() + '/changepassword', {
                username: this.username,
                password: this.password,
                newPassword: this.newPassword
            }).subscribe(
                (res) => {
                    this.toast.sendToast('Password was successfully changed', 'success', '', 5);
                    this.closeDialog();
                },
                (err: any) => {
                    this.posting = false;
                }
            );
        }
    }
}
