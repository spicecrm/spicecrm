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
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * a modal allowing th euser to change the password.
 * this runs outside of the backend service and requests direct http to be in line with the call from the login
 * the request is sent qizthout authentication
 */
@Component({
    selector: "user-changepassword-modal",
    templateUrl: "./src/modules/users/templates/userchangepasswordmodal.html"
})
export class UserChangePasswordModal {

    /**
     * the current password
     *
     * @private
     */
    private password: string = "";

    /**
     * the new password
     * @private
     */
    private newPassword: string = "";

    /**
     * the new password repeated
     * @private
     */
    private repeatPassword: string = "";

    /**
     * a regex for the password check that is built from the password requirements
     * @private
     */
    private pwdCheck: RegExp = new RegExp("//");

    /**
     * the password guideline in human readable format
     * @private
     */
    private pwdGuideline: string = "";

    /**
     * indicates that the user has reentered the password
     * this is used to enhance usability and not fire the repeat password error
     * also when the user has not yet reentered the password
     *
     * @private
     */
    private repFieldVisited = false;

    /**
     * reference toe hte modal itself
     */
    public self: any = undefined;

    /**
     * indicates that the modalis posting
     * @private
     */
    private posting: boolean = false;

    constructor(private http: HttpClient, private language: language, private session: session, private toast: toast, private configuration: configurationService) {
    }

    public ngOnInit() {
        this.getInfo();
    }

    /**
     * simple getter for the password error
     */
    get pwderror() {
        return !this.newPassword || !this.pwdCheck.test(this.newPassword) ? false : this.language.getLabel("MSG_PWD_NOT_LEGAL");
    }

    /**
     * simple getter if the repeated password does not match the initial one
     */
    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : this.language.getLabel("MSG_PWDS_DONT_MATCH"); // does not match password
    }

    /**
     * close the modal
     * @private
     */
    private close(): void {
        this.self.destroy();
    }

    /**
     * check if the user can save the new password
     * @private
     */
    private canSave(): boolean {
        return this.password && this.newPassword && this.pwderror === false && this.newPassword !== this.password && this.pwdreperror === false;
    }

    /**
     * save the changes
     * post unauthorized direct via http
     *
     * @private
     */
    private save(): void {
        if (this.canSave()) {
            this.http.post(this.configuration.getBackendUrl() + '/changepassword', {
                username: this.session.authData.userName,
                password: this.password,
                newPassword: this.newPassword
            }).subscribe(
                (res) => {
                    this.toast.sendToast(this.language.getLabel("MSG_PWD_CHANGED_SUCCESSFULLY"), 'info');
                    this.close();
                },
                (err: any) => {
                    this.toast.sendToast(this.language.getLabel("ERR_CHANGING_PWD"), "error", null, 10);
                    this.posting = false;
                }
            );
        }
    }

    /**
     * fetches and builds the infor for the password requirement
     *
     * @private
     */
    private getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp('/' + extConf.regex + '/');

        let requArray = [];
        if (extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if (extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if (extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if (extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

}
