/**
 * @module Outlook
 */
import {
    Component, inject, OnInit} from '@angular/core';

import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {TokenObjectI} from "../../../globalcomponents/interfaces/globalcomponents.interfaces";
import {OAuth2Service} from "../../../services/oauth2.service";
import {GlobalLogin} from "../../../globalcomponents/components/globallogin";
import {Subscription} from "rxjs";

declare var msal;
declare var Office;

/**
 * A component that handles the display of the SpiceCRM login form in the Outlook add-in
 * and the communication with SpiceCRM to confirm the login credentials.
 */
@Component({
    selector: 'outlook-login-pane',
    templateUrl: '../templates/outlookloginpane.html',
    providers: [OAuth2Service]
})
export class OutlookLoginPane extends GlobalLogin implements OnInit {

    private outlookConfiguration: OutlookConfiguration = inject(OutlookConfiguration);
    /**
     * rxjs subscription to unsubscribe
     * @private
     */
    private subscription = new Subscription();

    public ngOnInit() {
        this.initialize();
        this.subscribeToSysInfo();
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * subscribe to broadcast to reload the services
     * @private
     */
    private subscribeToSysInfo() {
        this.subscription.add(
            this.configuration.loaded$.subscribe((loaded) => {
                if (loaded) this.microsoftOAuthLogin();
            })
        )
    }

    private initialize() {

        if (this.outlookConfiguration.hasSettings()) {
            this.username = this.outlookConfiguration.username;
            this.password = this.outlookConfiguration.password;
            const token = {
                tokenObject: this.outlookConfiguration.tokenObject,
                issuer: this.outlookConfiguration.issuer,
                username: this.outlookConfiguration.username,
            };
            this.login(token);
        } else {
            this.goToSettings();
        }
    }

    public goToSettings() {
        this.promptUser = true;
        // empty credentials saved in office container
        this.outlookConfiguration.username = '';
        this.outlookConfiguration.password = '';
        this.outlookConfiguration.tokenObject = undefined;
        this.outlookConfiguration.issuer = '';
        this.outlookConfiguration.saveSettings();

    }

    /**
     * check for microsoft login service and trigger the login automatically
     */
    public async microsoftOAuthLogin() {

        const config = this.configuration.getCapabilityConfig('msgraphconfig');

        if (!config?.isActive) return;

        const url = this.configuration.getBackendUrl() + '/authentication/oauth2/accessToken';

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

        if (!loginResponse?.accessToken) return;

        this.login({
            issuer: 'Microsoft', tokenObject: {access_token: loginResponse.accessToken}, username: loginResponse.account.username
        });
    }
}
