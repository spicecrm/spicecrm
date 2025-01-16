/**
 * @module Outlook
 */
import {Component} from '@angular/core';
import {GlobalLogin} from "../../../globalcomponents/components/globallogin";

declare var msal;
declare var Office;

/**
 * A component that handles the display of the SpiceCRM login form in the Outlook add-in
 * and the communication with SpiceCRM to confirm the login credentials.
 */
@Component({
    selector: 'outlook-login-pane',
    templateUrl: '../templates/outlookloginpane.html',
})
export class OutlookLoginPane extends GlobalLogin {
    /**
     * error message on login failure
     */
    public error: string;

    set promptUser(value: boolean) {
        this._promptUser = value;
        if (value && !this.loginService.loggedOut && this.configuration.initialized) {
            this.microsoftOAuthLogin();
        }
    }

    /**
     * handle login after sys info load
     */
    public afterSysInfoLoad() {

        super.afterSysInfoLoad();

        if (this._promptUser && !this.loginService.loggedOut) {
            this.microsoftOAuthLogin();
        }
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * check for microsoft login service and trigger the login automatically
     */
    public async microsoftOAuthLogin() {

        this.loggingIn = true;

        const config = this.configuration.getCapabilityConfig('msgraphconfig');

        if (!config?.isActive) return;

        const msalConfig: any = {
            auth: {
                clientId: config.client_id,
                authority: `https://login.microsoftonline.com/${config.tenant_id}`,
                redirectUri: config.redirect_url,
            }
        };

        let msalInstance = new msal.PublicClientApplication(msalConfig);

        const loginRequest: any = {scopes: ["user.read", "mail.read"]};
        const authContext = await Office.auth.getAuthContext();

        loginRequest.loginHint = authContext?.loginHint;

        let loginResponse = await msalInstance.ssoSilent(loginRequest).catch(() => undefined);

        if (!loginResponse) {
            loginResponse = await msalInstance.loginPopup(loginRequest).catch(() => {
                return undefined;
            });
        }

        if (!loginResponse?.accessToken) {
            this.loggingIn = false;
            this.error = 'failed to login. Check the graph configuration.';
            return;
        }

        this.login({
            issuer: 'Microsoft', tokenObject: {access_token: loginResponse.accessToken}, username: loginResponse.account.username
        });
    }

    /**
     * override check passkey registration to be disabled since login will always be done by outlook
     * @param event
     * @param username
     */
    public async checkPasskeyRegistration(event?: MouseEvent, username?: string) {
        return;
    }
}
