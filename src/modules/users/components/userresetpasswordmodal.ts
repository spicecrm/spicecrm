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
import { helper } from '../../../services/helper.service';

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
        private configuration: configurationService,
        private helper: helper
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
        if ( value ) {
            this.password = this.helper.generatePassword(this.configuration.getCapabilityConfig('userpassword'));
            this.repeatPassword = this.password;
        }
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
        if (extConf.onespecial) requArray.push(this.language.getLabel('MSG_PASSWORD_ONESPECIAL'));
        if (extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
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
                forceReset: this.forceReset,
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
