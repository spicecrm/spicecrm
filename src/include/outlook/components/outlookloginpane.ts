/**
 * @module Outlook
 */
import {
    Component, inject, OnInit} from '@angular/core';

import {OutlookConfiguration} from '../services/outlookconfiguration.service';
import {AuthServiceI, TokenObjectI} from "../../../globalcomponents/interfaces/globalcomponents.interfaces";
import {OAuth2Service} from "../../../services/oauth2.service";
import {Subscription} from "rxjs";
import {GlobalLogin} from "../../../globalcomponents/components/globallogin";

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

    private oauth2Service: OAuth2Service = inject(OAuth2Service);

    public ngOnInit() {
        this.initialize();
    }

    private initialize() {

        if (this.outlookConfiguration.hasSettings()) {
            this.username = this.outlookConfiguration.username;
            this.password = this.outlookConfiguration.password;
            const token = {
                tokenObject: this.outlookConfiguration.tokenObject,
                issuer: this.outlookConfiguration.issuer
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
     * @param service
     */
    public checkForMicrosoftLoginService(service: AuthServiceI[]) {

        const microsoftService: AuthServiceI = service.find(s => s.config.userinfo_endpoint.includes('microsoft'));

        if (!microsoftService) return;

        const url = this.configuration.getBackendUrl() + '/authentication/oauth2/accessToken';

        this.oauth2Service.config = {
            client_id: microsoftService.config.client_id,
            scope: microsoftService.config.scope,
            token_endpoint: microsoftService.config.token_endpoint,
            userinfo_endpoint: microsoftService.config.userinfo_endpoint,
            login_url: microsoftService.config.login_url,
            redirect_uri: microsoftService.config.redirect_uri,
            client_secret: microsoftService.config.client_secret
        };

        this.oauth2Service.codeFlowLogin().subscribe(code => {

            this.http.post(url, {issuer: microsoftService.issuer, code: code}).subscribe(
                (data: {tokenObject: TokenObjectI, profile}) => {

                    this.login({
                        issuer: microsoftService.issuer, tokenObject: data.tokenObject
                    });
                });
        })
    }
}
