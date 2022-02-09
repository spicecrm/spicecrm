/**
 * @module GlobalComponents
 */
import {HttpClient} from "@angular/common/http";
import {Component, Host, Input} from "@angular/core";
import {toast} from "../../services/toast.service";
import {Auth2ServiceConfigI, AuthServiceI} from "../interfaces/globalcomponents.interfaces";
import {GlobalLoginOAuth2} from "./globalloginoauth2";
import {configurationService} from "../../services/configuration.service";
import {OAuth2Service} from "../../services/oauth2.service";

/**
 * a login button that triggers the authentication via OAuth2 if that is enabled for the system
 */
@Component({
    selector: "global-login-oauth2-button",
    templateUrl: "../templates/globalloginoauth2button.html",
    providers: [OAuth2Service]
})
export class GlobalLoginOAuth2Button {
    /**
     * holds the authenticated user data
     */
    @Input() public authenticatedUser: string;
    /**
     * determines if the button is rendered or not
     */
    public visible: boolean = false;
    /**
     * if the button is disabled while the libraries are loading
     */
    public disabled: boolean = true;

    constructor(
        public http: HttpClient,
        public oauth2Service: OAuth2Service,
        public configurationService: configurationService,
        @Host() private parent: GlobalLoginOAuth2,
        public toast: toast
    ) {

    }

    /**
     * holds the service data
     */
    private _service: AuthServiceI;

    /**
     * @return service data
     */
    get service(): AuthServiceI {
        return this._service;
    }

    /**
     * holds the service data
     */
    @Input('service') set service(value: AuthServiceI) {
        if (!value) return;
        this._service = value;
        this.initialize(value.config);
    }

    /**
     * initialize and load the oauth libraries
     */
    public initialize(config: Auth2ServiceConfigI) {

        if (!config?.client_id || !config.login_url || !config.userinfo_endpoint || !config.token_endpoint) return this.disabled = true;

        this.visible = true;

        this.oauth2Service.config = {
            client_id: config.client_id,
            scope: config.scope,
            token_endpoint: config.token_endpoint,
            userinfo_endpoint: config.userinfo_endpoint,
            login_url: config.login_url,
            redirect_uri: config.redirect_uri,
            client_secret: config.client_secret
        };

        // set visible and enable the button
        this.disabled = false;
    }

    /**
     * sign in with oauth2
     * @param event
     */
    public signIn(event) {

        event.preventDefault();
        event.stopPropagation();

        const url = this.configurationService.getBackendUrl() + '/authentication/oauth2/accessToken';

        this.oauth2Service.codeFlowLogin().subscribe(code => {

            this.http.post(url, {issuer: this.service.issuer, code: code}).subscribe((data: {accessToken, profile}) => {

                if (this.authenticatedUser) {

                    if (this.authenticatedUser == data.profile.email) {

                        this.parent.token.emit({
                            issuer: this.service.issuer, accessToken: data.accessToken
                        });

                    } else {
                        this.toast.sendToast('Wrong username', 'warning', 'usernames do not match, please relogin with the proper user');
                    }
                } else {
                    this.parent.token.emit({
                        issuer: this.service.issuer, accessToken: data.accessToken
                    });
                }
            });
        })
    }
}
