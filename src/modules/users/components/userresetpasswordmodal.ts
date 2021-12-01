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
    templateUrl: "../templates/userresetpasswordmodal.html"
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
    public password: string = undefined;

    /**
     * the password again to ensure it has been properly enterewd
     * @private
     */
    public repeatPassword: string = undefined;

    /**
     * the regex to check the password
     *
     * @private
     */
    public pwdCheck: RegExp = new RegExp("//");

    /**
     * the composed text for the pwd guideline
     * @private
     */
    public pwdGuideline: string = undefined;

    /**
     * holds the info if the password is auto generated
     *
     * @private
     */
    public autogenerate: boolean = false;

    /**
     * set if the password shpudl be sent via email
     * @private
     */
    public sendByEmail: boolean = false;

    /**
     * toggle to show the password
     *
     * @private
     */
    public showPassword: boolean = false;

    /**
     * force reset on the next login
     */
    public forceReset: boolean = true;

    /**
     * a string to break the autocomplete
     *
     * @private
     */
    public autocompletebreaker: string = '';

    /**
     * set to know we are in the update process
     *
     * @private
     */
    public updating: boolean = false;

    constructor(
        public model: model,
        public language: language,
        public toast: toast,
        public session: session,
        public backend: backend,
        public configuration: configurationService
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
    public toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    /**
     * copies the password to the clipboard
     * @private
     */
    public copyPassword() {
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
    public getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];
        if (extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if (extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if (extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if (extConf.onespecial) requArray.push(this.language.getLabel('MSG_PASSWORD_ONESPECIAL'));
        if (extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

    /**
     * generates a password that matches the minimal requiremens
     * fills it up with lower case chars to the required minimum length
     *
     * @private
     */
    public generatePassword() {
        let passwordChars: string[] = [];
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        if (extConf.onelower) passwordChars.push(this.randomLower());
        if (extConf.oneupper) passwordChars.push(this.randomUpper());
        if (extConf.onenumber) passwordChars.push(this.randomNumber());
        if (extConf.onespecial) passwordChars.push(this.randomSpecial());

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
    public shuffle(arr) {
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
    public randomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    /**
     * returns a random lower character
     * @private
     */
    public randomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    /**
     * returns a random special character
     * @private
     */
    public randomSpecial() {
        let pool = '!"#$%&\'()*+,-./:;<=>?@[\\]^_{|}~';
        return pool.charAt( Math.floor(Math.random() * pool.length ));
    }

    /**
     * returns a random number (digit)
     *
     * @private
     */
    public randomNumber() {
        return String.fromCharCode((Math.floor(Math.random() * 10) + 48));
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
    public setPassword() {
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
    public close() {
        this.self.destroy();
    }
}
