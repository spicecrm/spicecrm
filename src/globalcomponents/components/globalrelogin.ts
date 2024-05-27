/**
 * @module GlobalComponents
 */
import {
    Component, EventEmitter, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {session} from '../../services/session.service';
import {Config2FAI, TokenObjectI} from "../interfaces/globalcomponents.interfaces";
import {configurationService} from "../../services/configuration.service";
import {toast} from "../../services/toast.service";

/**
 * a modal to prompt the user for the password to relogin
 * this is rendered when an http request fails because the session is expired
 * it prompts the user to relogin with the current logged in user and the current login method
 */
@Component({
    selector: 'global-re-login',
    templateUrl: '../templates/globalrelogin.html',
})
export class GlobalReLogin {
    /**
     * identifies the focus element. If the field is set to edit mode a specific field can be set to be focused
     *
     * in case there are e.g. multiple inut elements define the most important one in the template
     */
    @ViewChild('twofactorinput', {read: ViewContainerRef, static: false}) public twofactorinput: ViewContainerRef;
    /**
     * reference to the modal itself
     *
     * @private
     */
   public self: any;

    /**
     * the password for the user
     *
     * @private
     */
   public password: string;

    /**
     * emits if the user logged in successfully
     *
     * @private
     */
    @Output()public loggedin: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * indicator that a relogin is running
     *
     * @private
     */
   public loggingIn: boolean = false;
    /**
     * two-factor authentication active boolean
     */
    public twoFactorAuthCodeRequired: boolean = false;
    /**
     * input the two factory authentication token
     */
    public code2fa: string;
    /**
     * remember device
     */
    public rememberDevice: boolean = false;
    /**
     * remember device visible
     */
    public rememberDeviceVisible: boolean = false;

    constructor(public login: loginService,
                private toast: toast,
                public session: session,
                public configuration: configurationService) {
        this.load2FAConfig();
    }

    get loginLabels() {
        return this.configuration.data.languages?.required_labels ?? {};
    }

    /**
     * load 2FA Config
     * @private
     */
    private load2FAConfig() {

        const config: Config2FAI = this.configuration.getCapabilityConfig('login')?.twofactor;

        if (window._.isEmpty(config)) return;

        this.rememberDevice = config.onlogin.enforced == 'device_change';
        this.rememberDeviceVisible = config.onlogin.enforced != 'always';
    }

    public tokenLogin(token: {issuer: string, tokenObject: TokenObjectI}) {
        this.loggingIn = true;
        this.login.relogin(null, token.tokenObject).subscribe({
            next: res => {
                this.loggedin.emit(true);
                this.close();
            },
            error: () => {
                this.loggingIn = false;
            }
        });
    }

   public relogin() {
        this.loggingIn = true;
       this.login.authData.code2fa = this.code2fa;
       this.login.authData.rememberDevice = this.rememberDevice;
        this.login.relogin(this.password, null).subscribe({
            next: res => {
                    this.loggedin.emit(true);
                    this.close();
                },
            error: error => {
                if (error.errorCode == 4) {
                    this.toast.sendToast(error.message, "success");
                    this.twoFactorAuthCodeRequired = true;
                    setTimeout(() => {
                        if (this.twofactorinput) {
                            this.twofactorinput.element.nativeElement.focus();
                        }
                    });

                }
           this.loggingIn = false;
       }

   });
    }

    /**
     * cleans the session and renavigates to the login screen
     *
     * @private
     */
   public logout() {
        this.login.logout(true);
        this.close();
    }

    /**
     * closes the modal
     * @private
     */
   public close() {
        this.self.destroy();
    }
}
