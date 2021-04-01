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
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {session} from "../../../services/session.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * renders a modal to rest the password of a user and resend the password
 */
@Component({
    selector: "user-reset-password-modal",
    templateUrl: "./src/modules/users/templates/userresetpasswordmodal.html"
})
export class UserResetPasswordModal {

    /**
     * reference to the modal itself
     */
    public self: any = undefined;

    /**
     * the password
     *
     * @private
     */
    private password: string = undefined;

    /**
     * the password again to ensure it has been properly enterewd
     * @private
     */
    private repeatPassword: string = undefined;

    /**
     * the regex to check the password
     *
     * @private
     */
    private pwdCheck: RegExp = new RegExp("//");

    /**
     * the composed text for the pwd guideline
     * @private
     */
    private pwdGuideline: string = undefined;

    /**
     * holds the info if the password is auto generated
     *
     * @private
     */
    private autogenerate: boolean = false;

    /**
     * set if the password shpudl be sent via email
     * @private
     */
    private sendByEmail: boolean = false;

    /**
     * toggle to show the password
     *
     * @private
     */
    private showPassword: boolean = false;

    /**
     * force reset on the next login
     */
    private forceReset: boolean = true;

    /**
     * a string to break the autocomplete
     *
     * @private
     */
    private autocompletebreaker: string = '';

    /**
     * set to know we are in the update process
     *
     * @private
     */
    private updating: boolean = false;

    constructor(
        private model: model,
        private language: language,
        private toast: toast,
        private session: session,
        private backend: backend,
        private configuration: configurationService
    ) {

        this.getInfo();
    }

    /**
     * returns if the password does not match
     */
    get passwordError() {
        return this.password && !this.pwdCheck.test(this.password);
    }

    get repeatPasswordError() {
        return this.repeatPassword && this.password !== this.repeatPassword;
    }

    /**
     * geter for the autogenerate checkbox
     */
    get autoGenerate() {
        return this.autogenerate;
    }

    /**
     * toggle the autogenerate checkbox and trigger the creation
     *
     * @param value
     */
    set autoGenerate(value) {
        this.autogenerate = value;
        // this.password = value ? Math.random().toString(36).slice(-8) : undefined;
        this.password = value ? this.generatePassword() : undefined;
        this.repeatPassword = this.password;
    }

    /**
     * toggles if the password is human readable
     * @private
     */
    private toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    /**
     * copies the password to the clipboard
     * @private
     */
    private copyPassword() {
        if (!this.autoGenerate) {
            return;
        }

        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.password;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toast.sendToast("Password copied", "success");
    }


    /**
     * retrieves the info and builds the minimum password requirements
     *
     * @private
     */
    private getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];
        if (extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if (extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if (extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if (extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

    /**
     * generates a password that matches the minimal requiremens
     * fills it up with lower case chars to the required minimum length
     *
     * @private
     */
    private generatePassword() {
        let passwordChars: string[] = [];
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        if (extConf.onelower) passwordChars.push(this.randomLower());
        if (extConf.oneupper) passwordChars.push(this.randomUpper());
        if (extConf.onenumber) passwordChars.push(this.randomNumber());

        let minLength = extConf.minpwdlength ? parseInt(extConf.minpwdlength, 10) : 8;
        while (passwordChars.length < minLength) {
            passwordChars.push(this.randomLower());
        }

        passwordChars = this.shuffle(passwordChars);
        return passwordChars.join('');
    }

    /**
     * shuffles an array
     * @param array
     * @private
     */
    private shuffle(arr) {
        let currentIndex = arr.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }

        return arr;
    }

    /**
     * returns a radnom upper character
     * @private
     */
    private randomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    /**
     * returns a random lower character
     * @private
     */
    private randomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    /**
     * returns a random number
     *
     * @private
     */
    private randomNumber() {
        return String.fromCharCode((Math.floor(Math.random() * 9) + 48));
    }

    /**
     * getter to check if we can save
     */
    get canSave() {
        if (this.updating || this.passwordError || this.repeatPasswordError || !this.session.isAdmin) {
            return false;
        }
        return true;
    }

    /**
     * sets the password
     *
     * @private
     */
    private setPassword() {
        if (this.canSave) {
            this.updating = true;
            this.backend.postRequest(`module/Users/${this.model.id}/password/reset`, {}, {
                newPassword: this.password,
                forceReset: this.autoGenerate,
                sendEmail: this.sendByEmail
            }).subscribe(res => {
                this.close();
                this.toast.sendToast('Password Reset!', 'info');
            }, error => {
                this.updating = false;
                this.toast.sendToast("Error resetting the password", "error");
            });
        }
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }
}
