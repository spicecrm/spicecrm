/*
SpiceUI 2021.01.001

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
import {Component, EventEmitter, Output} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {toast} from '../../services/toast.service';
import {HttpClient} from "@angular/common/http";


@Component({
    selector: 'global-login-forgot-password',
    templateUrl: './src/globalcomponents/templates/globalloginforgotpassword.html'
})
export class GlobalLoginForgotPassword {
    /**
     * the users email address
     *
     * @private
     */
    private email: string = '';

    /**
     * the token the user sends
     *
     * @private
     */
    private token: string = '';

    /**
     * the password entered by the user
     * @private
     */
    private password: string = undefined;

    /**
     * holds the repeated password
     * @private
     */
    private repeatPassword: string = undefined;

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
     * defines the legth of the toekn that is either the minimum password length
     * defaults to 6 if not set
     *
     * @private
     */
    private tokenLength: number = 6;

    /**
     * indicates that we are sending and thus closes the various inputs and disables the buttons
     *
     * @private
     */
    private sending: boolean = false;

    /**
     * set to display the
     * @private
     */
    private display: 'email'|'token' = 'email';


    /**
     * emit true to close the reset window
     *
     * @private
     */
    @Output() private close: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * keep the active toast if we have one
     *
     * @private
     */
    private activeToast: string;

    constructor(
        private http: HttpClient,
        private configuration: configurationService,
        private toast: toast,
    ) {
        this.getInfo();
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
        if (extConf.minpwdlength) {
            requArray.push('minimum length ' + extConf.minpwdlength);
            this.tokenLength = parseInt(extConf.minpwdlength, 10);
        }

        this.pwdGuideline = requArray.join(', ');
    }

    get pwderror() {
        return this.password && !this.pwdCheck.test(this.password) ? 'Password does not match the Guideline.' : false;
    }

    get pwdreperror() {
        return this.password == this.repeatPassword ? false : 'Inputs for the new Password does not match.'; // does not match password
    }

    /**
     * regex for the email address validation
     *
     * @private
     */
    private emailValidation = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');


    /**
     * returns
     */
    get emailValid() {
        return this.email && this.email.length > 0 && this.emailValidation.test(this.email);
    }

    /**
     * request the token via email
     *
     * @private
     */
    private sendEmail() {
        if (this.emailValid) {
            // clear an error toast if we have one
            if(this.activeToast){
                this.toast.clearToast(this.activeToast);
            }

            // set to sending and send the request
            this.sending = true;
            this.http.get(this.configuration.getBackendUrl() + `/passwordtoken/email/${this.email}`).subscribe(
                (res: any) => {
                    this.display = 'token';
                    this.toast.sendToast('Successfully sent, check your inbox to get the token code', 'success');
                    this.sending = false;
                },
                (err: any) => {
                    this.activeToast = this.toast.sendToast('there was an error sending the token', 'error', 'Please verify that the mail is correect or contact a system administrator');
                    this.sending = false;
                }
            );
        }
    }

    /**
     * checks if we have a valid token and a valid password
     */
    get canSendToken() {
        return this.token.length == this.tokenLength && !this.pwderror && !this.pwdreperror;
    }

    /**
     * resets the password with the token
     *
     * @private
     */
    private resetPassword() {
        if (this.canSendToken) {
            // clear an error toast if we have one
            if(this.activeToast){
                this.toast.clearToast(this.activeToast);
            }

            // submit the request
            this.sending = true;
            this.http.post(
                this.configuration.getBackendUrl() + `/passwordtoken/token/${this.token}`,
                {
                    newPassword: this.password
                }
            ).subscribe(
                (res: any) => {
                    this.close.emit(true);
                    this.sending = false;
                },
                (err: any) => {
                    this.activeToast = this.toast.sendToast('there was an error resetting your password', 'error', 'please contact a system administrator');
                    this.sending = false;
                }
            );
        }
    }

}
