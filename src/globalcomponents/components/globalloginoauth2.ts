/**
 * @module GlobalComponents
 */
import {HttpClient} from "@angular/common/http";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {libloader} from "../../services/libloader.service";
import {toast} from "../../services/toast.service";
import {OAuthService} from "angular-oauth2-oidc";

/**
 * a login button that triggers the authentication via OAuth2 if that is enabled for the system
 */
@Component({
    selector: "global-login-oauth2",
    templateUrl: "../templates/globalloginoauth2.html"
})
export class GlobalLoginOAuth2 {

    @Input() public authenticatedUser: string;
    /**
     * determines if the buitton is rendered or not
     */
    public visible: boolean = false;
    /**
     * if the button is disabled while the libraries are loading
     */
    public disabled: boolean = true;

    /**
     * emits the token
     *
     * @private
     */
    @Output() public token: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        public backend: backend,
        public configuration: configurationService,
        public http: HttpClient,
        public loginService: loginService,
        public session: session,
        public libloader: libloader,
        public oauthService: OAuthService,
        public toast: toast
    ) {
        this.configuration.loaded$.subscribe((loaded) => {
            if (loaded) this.initialize();
        });
    }

    /**
     * initialize and load the oauth libraries
     */
    public initialize() {

        let config = this.configuration.getCapabilityConfig('oauth2');

        if (config?.clientid) return this.disabled = true;

        this.visible = true;

        this.oauthService.configure({
            ...config,
            showDebugInformation: true,
            oidc: false,
            responseType: 'code'
        });

        this.oauthService.dummyClientSecret = config.client_secret;

        this.oauthService.loadDiscoveryDocument(config.discoveryDocumentUrl).catch(() => {

            if (!config.loginUrl || !config.userinfo_endpoint || !config.token_endpoint) {
                return this.disabled = true;
            }

            this.oauthService.loginUrl = config.loginUrl;
            this.oauthService.userinfoEndpoint = config.userinfo_endpoint;
            this.oauthService.tokenEndpoint = config.token_endpoint;
        });

        // set visible and enable the button
        this.disabled = false;
    }

    /**
     * get the google token
     *
     * @param event
     */
    public signIn(event) {

        event.preventDefault();
        event.stopPropagation();

        this.oauthService.initLoginFlowInPopup().then(res => {

            const token = this.oauthService.getAccessToken();

            this.oauthService.loadUserProfile().then((profile: any) => {

                // todo check the email field name

                if (!this.authenticatedUser || (this.authenticatedUser && this.authenticatedUser == profile.email)) {

                    this.token.emit(token);

                } else if (this.authenticatedUser && this.authenticatedUser != profile.email) {
                    this.toast.sendToast('Wrong username', 'warning', 'usernames do not match, please relogin with the proper user');
                }

                this.token.emit(
                    this.oauthService.getAccessToken()
                );
            })
        }).catch(res => {
            console.log(res);
        });
    }
}
