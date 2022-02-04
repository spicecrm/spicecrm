/**
 * @module GlobalComponents
 */
import {HttpClient} from "@angular/common/http";
import {Component, Host, Input} from "@angular/core";
import {toast} from "../../services/toast.service";
import {OAuthService} from "angular-oauth2-oidc";
import {Auth2ServiceConfigI, AuthServiceI} from "../interfaces/globalcomponents.interfaces";
import {GlobalLoginOAuth2} from "./globalloginoauth2";

/**
 * a login button that triggers the authentication via OAuth2 if that is enabled for the system
 */
@Component({
    selector: "global-login-oauth2-button",
    templateUrl: "../templates/globalloginoauth2button.html",
    providers: [OAuthService]
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
        public oauthService: OAuthService,
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

        if (!config?.client_id) return this.disabled = true;

        this.visible = true;

        this.oauthService.configure({
            issuer: config.issuer,
            clientId: config.client_id,
            scope: config.scope,
            redirectUri: config.redirect_uri,
            showDebugInformation: true,
            oidc: false,
            responseType: 'code'
        });

        this.oauthService.dummyClientSecret = config.client_secret;

        this.oauthService.loadDiscoveryDocument(config.discovery_document_url).catch(() => {

            if (!config.login_url || !config.userinfo_endpoint || !config.token_endpoint) {
                return this.disabled = true;
            }

            this.oauthService.loginUrl = config.login_url;
            this.oauthService.userinfoEndpoint = config.userinfo_endpoint;
            this.oauthService.tokenEndpoint = config.token_endpoint;
        });

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

        this.oauthService.initLoginFlowInPopup().then(res => {

            const accessToken = this.oauthService.getAccessToken();


                this.oauthService.loadUserProfile().then((profile: any) => {

                    if (this.authenticatedUser == profile.email) {

                        this.parent.token.emit({issuer: this.service.issuer, accessToken});

                    } else if (this.authenticatedUser != profile.email) {
                        this.toast.sendToast('Wrong username', 'warning', 'usernames do not match, please relogin with the proper user');
                    }

                    this.parent.token.emit({
                        accessToken: this.oauthService.getAccessToken(),
                        issuer: this.service.issuer
                    });
                });

        }).catch(res => {
            console.log(res);
        });
    }
}
