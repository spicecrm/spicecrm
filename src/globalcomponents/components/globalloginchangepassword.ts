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
    templateUrl: '../templates/globalloginchangepassword.html'
})
export class GlobalLoginChangePassword {
    /**
     * the old password to check that the password has been changed
     * @private
     */
    @Input('password')public password: string;

    /**
     * the id ot the user that tried to log in but has an expired password
     * @private
     */
    @Input('username')public username: string;

    /**
     * emits if the prompt should be closed again
     *
     * @private
     */
    @Output()public closeRenewDialog: EventEmitter<string> = new EventEmitter<string>();

    /**
     * the entered password
     * @private
     */
   public newPassword: string;

    /**
     * the repeated password
     * @private
     */
   public repeatPassword: string;

    /**
     * the regex to match the password requirements
     * @private
     */
   public pwdCheck: RegExp = new RegExp('//');

    /**
     * the text for the password requriements
     * @private
     */
   public pwdGuideline: string;

    /**
     * if we are psoting the password
     * @private
     */
   public posting: boolean = false;

    constructor(public loginService: loginService,
               public http: HttpClient,
               public configuration: configurationService,
               public toast: toast,
               public session: session,
               public language: language
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
     * @param password
     */
    public closeDialog(password?: string) {
        this.closeRenewDialog.emit(password);
    }


    /*
    * retrieve password guideline
    */
   public getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];

        if (extConf.onelower) requArray.push('one lower case');
        if (extConf.oneupper) requArray.push('one upper case');
        if (extConf.onenumber) requArray.push('one number');
        if (extConf.onespecial) requArray.push('one special');
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
   public setPassword() {
        if (this.canSave) {
            this.posting = true;
            this.http.post(this.configuration.getBackendUrl() + '/authentication/changepassword', {
                username: this.username,
                password: this.password,
                newPassword: this.newPassword
            }).subscribe(
                (res) => {
                    this.toast.sendToast('Password was successfully changed', 'success', '', 5);
                    this.closeDialog(this.newPassword);
                },
                (err: any) => {
                    this.posting = false;
                }
            );
        }
    }
}
