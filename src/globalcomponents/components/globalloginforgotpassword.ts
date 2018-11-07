import {Component, EventEmitter, Output} from '@angular/core';
import {configurationService} from '../../services/configuration.service';
import {toast} from '../../services/toast.service';
import {HttpClient} from "@angular/common/http";


@Component({
    selector: 'global-login-forgot-password',
    templateUrl: './src/globalcomponents/templates/globalloginforgotpassword.html',
    host: {
        '(window:keypress)': 'this.keypressed($event)'
    }
})
export class GlobalLoginForgotPassword {
    email: string = '';
    token: string = '';
    password: string = undefined;
    repeatPassword: string = undefined;
    pwdCheck: RegExp = new RegExp('//');
    pwdGuideline: string = '';
    infoLoaded: boolean = false;
    emailEmpty: boolean = false;
    tokenEmpty: boolean = false;
    tokenInvalid: boolean = false;
    promptUser: boolean = false;
    showForgotPasswordEmail: boolean = true;
    promptNewPass: boolean = false;
    showForgotPasswordToken: boolean = false;
    @Output() hasNewPassword: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private http: HttpClient,
        private configuration: configurationService,
        private toast: toast,
    ) {
        this.getInfo();
    }

    getInfo() {
        this.http.get(this.configuration.getBackendUrl() + '/forgotPassword/info').subscribe((res: any) => {
            this.pwdCheck = new RegExp(res.pwdCheck.regex);
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

    get pwderror() {
        return this.password && !this.pwdCheck.test(this.password) ? 'Password does not match the Guideline.' : false;
    }
    get pwdreperror() {
        return this.password == this.repeatPassword ? false : 'Inputs for the new Password does not match.'; // does not match password
    }

    keypressed(event) {
        if (event.keyCode === 13) {
            if (this.showForgotPasswordEmail)
                this.sendEmail();
            if (this.showForgotPasswordToken)
                this.sendToken();
            if (this.promptNewPass)
                this.sendNewPass();
        }
    }

    sendEmail() {
        if (this.email.length > 0) {
            this.emailEmpty = false;
            this.http.get(this.configuration.getBackendUrl() + '/forgotPassword/' + this.email).subscribe(
                (res:any) => {
                    if (!res) {
                        this.toast.sendToast('User with the given email does not exist', 'error');
                    } else if(res.result == false) {
                        this.toast.sendToast(res.message, 'error');
                    } else {
                        this.showForgotPasswordToken = true;
                        this.showForgotPasswordEmail = false;
                        this.toast.sendToast('Successfully sent, check your inbox to get the token code', 'success');
                    }
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.showForgotPasswordEmail = true;
                            break;
                    }
                });
        } else {
            this.emailEmpty = true;
        }
    }

    sendToken() {
        if (this.token.length > 0) {
            this.tokenEmpty = false;
            this.http.post(
                this.configuration.getBackendUrl() + '/forgotPassword/' + this.email + "/" + this.token,
                {},
            ).subscribe(
                (res: any) => {
                    var response = res;
                    this.showForgotPasswordEmail = false;
                    if (response.token_valid) {
                        this.showForgotPasswordToken = false;
                        this.promptNewPass = true;
                    } else {
                        this.tokenInvalid = true;
                        this.toast.sendToast(
                            'Token or email is invalid',
                            'error',
                            'Token is expired, or invalid or does not belong to this email address',
                            false,
                        );
                    }

                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.showForgotPasswordToken = true;
                            break;
                    }
                });
        } else {
            this.emailEmpty = true;
        }
    }

    sendNewPass() {
        if(this.infoLoaded)
            if(this.pwderror) return false;

        if (this.password && this.pwdreperror == false) {
            this.http.post(this.configuration.getBackendUrl() + '/forgotPassword/resetPass', {
                "email": this.email,
                "token": this.token,
                "password": this.password
            }).subscribe(
                (res) => {
                    this.promptNewPass = false;
                    this.toast.sendToast(
                        'please log in with new password',
                        'default',
                        'please return to login form and enter login data with new password',
                        false,
                    );
                    this.hasNewPassword.emit(false);
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