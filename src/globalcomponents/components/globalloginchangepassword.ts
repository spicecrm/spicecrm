/**
 * @module GlobalComponents
 */
import {Component, ComponentRef, Input, Optional} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {HttpClient} from "@angular/common/http";
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';
import {Subscription} from 'rxjs';
import {GlobalLogin} from "./globallogin";
import {backend} from "../../services/backend.service";

/**
 * renders a dialog to change the password when the user logs in and is required to do this
 */
@Component({
    selector: 'global-login-change-password',
    templateUrl: '../templates/globalloginchangepassword.html'
})
export class GlobalLoginChangePassword {

    /**
     * the old password to check that the password has been changed
     * @public
     */
    @Input() public password: string;

    /**
     * the id ot the user that tried to log in
     * @public
     */
    @Input() public username: string;

    /**
     * the entered password
     * @public
     */
    public newPassword: string;

    /**
     * the repeated password
     * @public
     */
    public repeatPassword: string;

    /**
     * the regex to match the password requirements
     * @public
     */
    public pwdCheck: RegExp = new RegExp('//');

    /**
     * the text for the password requriements
     * @public
     */
    public pwdGuideline: string;

    /**
     * if we are posting the password
     * @public
     */
    public isPosting = false;

    /**
     * Indicates loading of backend data.
     */
    public isLoading = false;
    public subscriptions: Subscription = new Subscription();
    private self: ComponentRef<GlobalLoginChangePassword>;
    /**
     * true when user input enabled
     */
    @Input() public oldPasswordUserInputEnabled: boolean = true;
    /**
     * true when two-factor authentication active
     */
    public twoFactorAuthCodeRequired: boolean = false;
    /**
     * input for two-factor authentication code
     */
    public code2fa: string;

    constructor(public loginService: loginService,
                public http: HttpClient,
                public configuration: configurationService,
                public toast: toast,
                public session: session,
                public language: language,
                private backend: backend,
                @Optional() private loginComponent: GlobalLogin
    ) {
        this.buildGuidelineText();
    }

    /**
     * checks that the new passoword is different than the old
     */
    get oldPwError() {
        return (this.oldPasswordUserInputEnabled && !!this.password && this.password == this.newPassword) ? this.getLabel('MSG_OLD_PWD_NOT_AS_NEW') : false;
        // 'Old password is not allowed to be used as a new password'
    }

    /**
     * check that the password matches the requirements
     */
    get pwderror() {
        return this.newPassword && !this.pwdCheck.test(this.newPassword) ? this.getLabel('MSG_PWD_NOT_LEGAL') : false;
    }

    /**
     * checks that the new password has been typed correctly
     */
    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : this.getLabel('MSG_PWDS_DONT_MATCH'); // does not match password
    }

    /**
     * checks if the password can be saved
     */
    get canSavePwd() {
        return this.newPassword && this.oldPwError == false && this.pwderror == false && this.pwdreperror == false && !this.isPosting;
    }

    /**
     * closes the dialog
     * @param password
     */
    public close(password?: string) {
        if (!!password && this.loginComponent) {
            this.loginComponent.password = password;
            this.loginComponent.login();
        }
        this.self.destroy();
    }

    /*
    * build password guideline text
    */
    public buildGuidelineText() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];

        if (extConf.onelower) requArray.push(this.getLabel('LBL_ONE_LOWERCASE'));
        if (extConf.oneupper) requArray.push(this.getLabel('LBL_ONE_UPPERCASE'));
        if (extConf.onenumber) requArray.push(this.getLabel('LBL_ONE_DIGIT'));
        if (extConf.onespecial) requArray.push(this.getLabel('LBL_ONE_SPECIALCHAR'));
        if (extConf.minpwdlength) requArray.push(this.getLabel('LBL_MIN_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

    /**
     * change the password for the user
     * send an unauthenticated request to the backend
     */
    public setPassword() {

        if (!this.canSavePwd) return;

        this.isPosting = true;
        this.subscriptions.add(
            this.backend.postRequest('authentication/changepassword', null, {
                username: this.username ?? this.session.authData.userName,
                password: this.password,
                newPassword: this.newPassword,
                code2fa: this.code2fa
            }).subscribe({
                next: (res) => {
                    this.toast.sendToast(this.getLabel('MSG_PWD_CHANGED_SUCCESSFULLY'), 'success', '', 5);
                    this.close(this.newPassword);
                },
                error: (err: any) => {
                    switch (err.error?.error?.errorCode) {
                        case 'no2FACode':
                            this.twoFactorAuthCodeRequired = true;
                            this.toast.sendToast(err.error.error.message, 'success');
                            break;
                        case 'invalid2FACode':
                            this.toast.sendToast('MSG_INVALID_CODE', 'error');
                            break;
                    }
                     this.isPosting = false;
                }
            })
        );
    }

    /**
     * Retrieve a specific label.
     * @param name Label Name
     * @param type Label Type ('default', 'short' or 'long')
     */
    public getLabel(name: string, type: 'default' | 'short' | 'long' = 'default') {
        return this.language.getLabel(name, undefined, type);
    }

    /**
     * unsubscribe from rxjs subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
