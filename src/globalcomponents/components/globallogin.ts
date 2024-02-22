/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, Injector, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Config2FAI, TokenObjectI} from "../interfaces/globalcomponents.interfaces";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";
import {Subscription} from "rxjs";
import {GlobalLoginChangePassword} from "./globalloginchangepassword";
import {GlobalLogin2FAMethodSelectModal} from "./globallogin2famethodselectmodal";
import {
    TOTPAuthenticationGenerateModal
} from "../../include/totpauthentication/components/totpauthenticationgeneratemodal";


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
export class GlobalLogin implements OnDestroy {

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
    public keepMeLoggedIn: boolean = false;
    /**
     * remember device
     */
    public rememberDevice: boolean = false;
    /**
     * remember device visible
     */
    public rememberDeviceVisible: boolean = false;
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
     * indicates that we are in the login process
     */
    public loggingIn: boolean = false;
    /**
     * holds the rxjs subscription to unsubscribe on destroy
     * @private
     */
    private subscriptions = new Subscription();

    constructor(public loginService: loginService,
                public http: HttpClient,
                public configuration: configurationService,
                public session: session,
                public toast: toast,
                public broadcast: broadcast,
                public sanitizer: DomSanitizer,
                public changeDetectorRef: ChangeDetectorRef,
                private modal: modal,
                private injector: Injector,
                private language: language
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

        this.initializeNecessaryLanguageData();
        this.load2FAConfig();
        this.subscriptions = this.configuration.loaded$.subscribe(() => {
            this.initializeNecessaryLanguageData();
            this.load2FAConfig();
        });
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * load 2FA Config
     * @private
     */
    private load2FAConfig() {

        const config: Config2FAI = this.configuration.getCapabilityConfig('login')?.twofactor;

        if (window._.isEmpty(config)) return;

        this.rememberDevice = config.onlogin.enforced == 'device_change';
        this.rememberDeviceVisible = config.onlogin.trustenabled && config.onlogin.enforced != 'always';
    }

    /**
     * initialize the provided language service on the login component scope with the necessary data initially loaded with the GET sysinfo request
     * @private
     */
    private initializeNecessaryLanguageData() {

        if (!this.configuration.data.languages || !window._.isEmpty(this.language.languagedata?.applang)) return;

        this.language.languagedata.applang = {};

        Object.keys(this.configuration.data.languages.required_labels).forEach(label => {
            this.language.languagedata.applang[label] = this.configuration.data.languages.required_labels[label];
        });
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
                this.loginService.authData.rememberDevice = this.rememberDevice;
                this.loginService.authData.code2fa = this.code2fa;
                this.loginService.authData.userName = this.username;
                this.loginService.authData.password = this.password;
                this.loginService.authData.keepMeLoggedIn = this.keepMeLoggedIn;
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

    /**
     * handle error
     * @param error
     * @private
     */
    private handleError(error: { errorCode: number, details?: { userId: string, methods: { value: string, label: string, address: string }[] }, message: string }) {
        switch (error.errorCode) {
            // invalid password/user
            case 1:
                this.messageId = this.toast.sendToast('error logging on with username and password', 'error');
                break;
            // password expired
            case 2:
                this.modal.openStaticModal(GlobalLoginChangePassword, true, this.injector).subscribe(ref => {
                    ref.instance.username = this.username;
                    ref.instance.password = this.password;
                    ref.instance.oldPasswordUserInputEnabled = false;
                });
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
            // no 2fa method selected
            case 7:
                this.modal.openStaticModal(GlobalLogin2FAMethodSelectModal, true, this.injector).subscribe(ref => {
                    ref.instance.methods = error.details?.methods;
                    ref.instance.credentials = {username: this.username, password: this.password};
                });
                break;
            // TOTP authentication required
            case 12:
                this.modal.openStaticModal(TOTPAuthenticationGenerateModal, true, this.injector).subscribe(ref => {
                    ref.instance.credentials = {username: this.username, password: this.password};
                    this.code2fa = ref.instance.code;
                    this.twoFactorAuthCodeRequired = true;
                    ref.instance.onValidationSuccess.subscribe(() =>
                        this.login()
                    );
                });
                break;
            default:
                this.messageId = this.toast.sendToast('error logging on', 'error', error.message);
                break;
        }

        this.session.endSession();
    }
}
