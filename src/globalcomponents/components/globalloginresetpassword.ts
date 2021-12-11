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
    templateUrl: '../templates/globalloginresetpassword.html',
    host: {
        '(window:keyup)': 'this.keypressed($event)'
    }
})
export class GlobalLoginResetPassword {
    /**
     * the old password to check that the password has been changed
     * @private
     */
    @Input('oldpassword')public oldPassword: string;

    /**
     * emits if the prompt should be closed again
     *
     * @private
     */
    @Output()public closeRenewDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * the entered password
     * @private
     */
   public password: string;

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
   public closeDialog() {
        this.closeRenewDialog.emit(true);
    }

    /*
    * handle change on enter and escape press
    */
   public keypressed(event) {
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
   public getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];
        if (extConf.onelower) requArray.push('one lower case');
        if (extConf.oneupper) requArray.push('one upper case');
        if (extConf.onespecial) requArray.push('one special');
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
   public sendNewPass() {

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
