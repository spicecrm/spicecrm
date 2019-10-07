/**
 * @module GlobalComponents
 */
import {Component, Input} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {toast} from '../../services/toast.service';


@Component({
    selector: 'global-login-reset-password',
    templateUrl: './src/globalcomponents/templates/globalloginresetpassword.html',
    host: {
        '(window:keyup)': 'this.keypressed($event)'
    }
})
export class GlobalLoginResetPassword {
    @Input('oldpassword') private oldPassword: string;
    private password: string;
    private repeatPassword: string;
    private promptNewPass: boolean = false;
    private pwdCheck: RegExp = new RegExp('//');
    private pwdGuideline: string;
    private infoLoaded = false;

    constructor(private loginService: loginService,
                private http: HttpClient,
                private configuration: configurationService,
                private toast: toast,
                private session: session) {
        this.getInfo();
    }

    get oldPwError() {
        return (this.oldPassword == this.password) ? 'Old password is not allowed to be used as a new password' : false;
    }

    get pwderror() {
        return this.password && !this.pwdCheck.test(this.password) ? 'Password does not match the Guideline.' : false;
    }

    get pwdreperror() {
        return this.password == this.repeatPassword ? false : 'Inputs for the new Password does not match.'; // does not match password
    }

    /*
    * handle change on enter and escape press
    */
    private keypressed(event) {
        if (event.key === 'Enter') {
            this.sendNewPass();
        }
        if (event.key === 'Escape') {
            this.loginService.logout();
        }
    }

    /*
    * retrieve password guideline
    */
    private getInfo() {
        this.http.get(this.configuration.getBackendUrl() + '/forgotPassword/info').subscribe((res: any) => {
            this.pwdCheck = new RegExp(res.pwdCheck.regex);
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

    /*
    * change the password for the user
    */
    private sendNewPass() {

        if (this.infoLoaded) {
            if (this.pwderror) return false;
        }

        if (this.password && this.pwdreperror == false && this.oldPwError == false) {

            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', this.session.authData.sessionId);

            this.http.post(this.configuration.getBackendUrl() + '/resetTempPass', {
                password: this.password,
            }, {headers: headers}).subscribe(
                (res) => {
                    this.session.authData.renewPass = false;
                    this.toast.sendToast('Password was successfully changed', 'success', '', 5);
                    this.loginService.load();
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.promptNewPass = true;
                            break;
                    }
                });
        }
    }
}
