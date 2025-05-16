/**
 * @module ModuleUsers
 */
import {Component, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {session} from "../../../services/session.service";
import {configurationService} from "../../../services/configuration.service";
import {helper} from '../../../services/helper.service';

/**
 * renders a modal to rest the password of a user and resend the password
 */
@Component({
    selector: "user-reset-password-modal",
    templateUrl: "../templates/userresetpasswordmodal.html"
})
export class UserResetPasswordModal implements OnInit {

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
     * holds the info if the password is auto generated
     *
     * @private
     */
    public externalAuthOnly: boolean = false;

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
        public configuration: configurationService,
        public helper: helper
    ) {

        this.getInfo();
    }

    public ngOnInit() {
        this.externalAuthOnly = this.model.getField('external_auth_only');
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
        if (value) {
            this.password = this.helper.generatePassword(this.configuration.getCapabilityConfig('userpassword'));
            this.repeatPassword = this.password;
        }
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
        navigator.clipboard.writeText(this.password)
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
     * getter to check if we can save
     */
    get canSetPassword() {
        if (this.updating || !this.password || this.passwordError || this.repeatPasswordError || !this.session.isAdmin) {
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
        if (this.canSetPassword) {
            this.updating = true;
            this.backend.postRequest(`module/Users/${this.model.id}/password/reset`, {}, {
                newPassword: this.password,
                forceReset: this.forceReset,
                sendEmail: this.sendByEmail
            }).subscribe({
                next: (res) => {
                    // set external auth on the model
                    if(this.externalAuthOnly != this.model.getField('external_auth_only')){
                        this.model.setField('external_auth_only', this.externalAuthOnly);
                    }

                    // set the system generated password
                    this.model.setField('system_generated_password', this.forceReset);

                    this.close();
                    this.toast.sendToast('LBL_PASSWORD_RESETTED', 'info');
                },
                error: (error) => {
                    this.updating = false;
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.lbl ? this.language.getLabel( error.error.error.lbl ) : error.error.error.message );
                }
            });
        }
    }

    /**
     * checks if we can save the external auth as this has been changed
     */
    get canSave() {
        return this.externalAuthOnly != this.model.getField('external_authg_only');
    }

    /**
     * saves the external auth only flag
     */
    public save() {
        if (this.canSave) {
            this.updating = true;
            this.backend.putRequest(`module/Users/${this.model.id}/externalauthonly`).subscribe({
                next: (res) => {
                    this.model.setField('external_auth_only', this.externalAuthOnly);
                    this.model.setField('system_generated_password', false);
                    this.close();
                    this.toast.sendToast('LBL_RECORD_UPDATED', 'info');
                },
                error: (error) => {
                    this.updating = false;
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.lbl ? this.language.getLabel( error.error.error.lbl ) : error.error.error.message );
                }
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
