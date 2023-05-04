/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {TokenObjectI} from "../interfaces/globalcomponents.interfaces";


/**
 * @ignore
 */
declare var _: any;

/**
 * the login component that is rendered on the login screen and prompts for username and password resp offers alternative login methods
 */
@Component({
    selector: 'global-login',
    templateUrl: '../templates/globallogin.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalLogin {

    /**
     * identifies the focus element. If the field is set to edit mode a specific field can be set to be focused
     *
     * in case there are e.g. multiple inut elements define the most important one in the template
     */
    @ViewChild('twofactorinput', {read: ViewContainerRef, static: false}) public twofactorinput: ViewContainerRef;

    /**
     * two-factor authentication active boolean
     */
    public twoFactorAuthCodeRequired: boolean = false;
    /**
     * holds the prompt user boolean
     */
    public promptUser: boolean = false;
    /**
     * the username
     */
    public username: string = '';
    /**
     * the password
     */
    public password: string = '';
    /**
     * the password
     */
    public rememberMe: boolean = false;
    /**
     * input the two factory authentication token
     */
    public code2fa: string;

    /**
     * determine if the forgotten password is open or not
     */
    public showForgotPass: boolean = false;

    /**
     * variable to hold if per config the external side bar should be shown
     * ToDo: move to separate component
     */
    public externalSidebarUrl: SafeResourceUrl = null;
    /**
     * the id of the last message if a toast was sent
     *
     * @private
     */
    public messageId: string;
    /**
     * indicators to show the dialog for the new password or the TOTP generation
     */
    public renewPassword = false;
    /**
     * generate one-time password token boolean
     */
    public generateTOTP = false;
    /**
     * indicates that we are in the login process
     */
    public loggingIn: boolean = false;
    /**
     * Specific labels got from the backend.
     */
    public labels: any;

    constructor(public loginService: loginService,
                public http: HttpClient,
                public configuration: configurationService,
                public session: session,
                public toast: toast,
                public broadcast: broadcast,
                public sanitizer: DomSanitizer,
                public changeDetectorRef: ChangeDetectorRef
    ) {
        this.session.loadFromStorage();

        if (!!this.session.authData.sessionId) {

            // try to log in with the found token
            this.loginService.tokenObject = {access_token: this.session.authData.sessionId};
            this.loginService.oauthIssuer = 'SpiceCRM';
            this.loginService.login(false).subscribe({
                next: () => {
                    this.broadcast.broadcastMessage('login');
                },
                error: (err) => {

                    this.handleError(err);

                    this.loginService.tokenObject = null;
                    this.loginService.oauthIssuer = null;

                    this.promptUser = true;
                }
            });
        } else {
            this.promptUser = true;
        }
    }

    /**
     * a helper functions that returns if the sidebar in teh login screen should be shown or not
     */
    get showSidebar() {
        return this.configuration.data.displayloginsidebar !== false && window.innerWidth >= 1024;
    }

    /**
     * a helper to return if the content of the sidebar shoudl be rendered as default or if the extenrla sidebar shoudl be shown.
     *
     * an external sidebar can be added if in the config fot the site the property loginSidebarUrl is set and points to a URL. that url is loaded in teh sidebar in an iframe
     */
    get showExternalSidebar() {
        try {
            let ret = !_.isEmpty(this.configuration.data.loginSidebarUrl);
            if (ret && this.externalSidebarUrl === null) {
                this.externalSidebarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.configuration.data.loginSidebarUrl);
            }
            return ret;
        } catch (e) {
            return false;
        }
    }

    get showNewsfeed() {
        try {
            if (!this.configuration.initialized) {
                return false;
            }
            return _.isEmpty(this.configuration.data.loginSidebarUrl);
        } catch (e) {
            return false;
        }
    }

    get showProgressBar() {
        return this.configuration.data.loginProgressBar;
    }

    get loginLabels() {
        return this.configuration.data.languages?.required_labels ?? {};
    }

    /**
     * register to the resize event that handles if the news feed should be shown or not
     */
    public handleResize() {
        this.changeDetectorRef.detectChanges();
    }

    /**
     * triggers the actual login itself
     */
    public login(token?: { issuer: string, tokenObject: TokenObjectI }) {

        if (token || (this.username && this.password)) {

            if (this.messageId) this.toast.clearToast(this.messageId);

            this.toast.clearAll();

            this.loggingIn = true;

            if (token) {
                this.loginService.authData.userName = null;
                this.loginService.authData.password = null;
                this.loginService.tokenObject = token.tokenObject;
                this.loginService.oauthIssuer = token.issuer;
            } else {
                this.loginService.authData.code2fa = this.code2fa;
                this.loginService.authData.userName = this.username;
                this.loginService.authData.password = this.password;
                this.loginService.authData.rememberMe = this.rememberMe;
                this.loginService.tokenObject = null;
                this.loginService.oauthIssuer = null;
            }
            this.loginService.login().subscribe({
                next: () => {
                    this.toast.clearAll();
                    this.loggingIn = false;
                },
                error: (error) => {
                    this.handleError(error);
                    this.loggingIn = false;
                }
            });
        }
    }

    /**
     * toggles the forgotten password screen elements
     */
    public showForgotPassword() {
        this.showForgotPass = !this.showForgotPass;
    }

    public handleRenewDialogClose(password?: string) {
        this.renewPassword = this.generateTOTP = false;
        if (!!password) {
            this.password = password;
            this.login();
        }
    }

    /**
     * handle error
     * @param error
     * @private
     */
    private handleError(error: { errorCode: number, details?: { labels }, message: string }) {
        switch (error.errorCode) {
            // invalid password/user
            case 1:
                this.messageId = this.toast.sendToast('error logging on with username and password', 'error');
                break;
            // password expired
            case 2:
                this.labels = error.details?.labels;
                this.renewPassword = true;
                this.generateTOTP = false;
                break;
                // invalid token
            case 3:
                this.messageId = this.toast.sendToast('invalid token', "error");
                break;
                // required 2FA code
            case 4:
                this.messageId = this.toast.sendToast(error.message, "success");
                this.twoFactorAuthCodeRequired = true;
                setTimeout(() => {
                    if (this.twofactorinput) {
                        this.twofactorinput.element.nativeElement.focus();
                    }
                });
                break;
            // TOTP authentication required
            case 12:
                this.labels = error.details?.labels;
                this.renewPassword = false;
                this.generateTOTP = true;
                break;
            default:
                this.messageId = this.toast.sendToast('error logging on', 'error', error.message);
                break;
        }

        this.session.endSession();
    }
}
