import {AfterViewInit, Component, ElementRef, EventEmitter, Output} from "@angular/core";
import {session} from "../../services/session.service";
import {loginService} from "../../services/login.service";
import {configurationService} from "../../services/configuration.service";

declare var gapi: any;

@Component({
    selector: 'google-signin',
    templateUrl: './app/globalcomponents/templates/googlesignin.html'
})
export class GoogleSigninComponent {

    private clientId: string = "";

    visible: boolean = false;

    private scope = [
        'profile',
        'email',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/contacts.readonly',
        'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/tasks',
    ].join(' ');

    public auth2: any;

    constructor(private loginService: loginService,
                private configuration: configurationService,
                private session: session) {
        this.configuration.loaded$.subscribe(loaded => {
            this.googleInit();
        })
    }

    public googleInit() {
        if (this.configuration.data.backendextensions.hasOwnProperty("google_oauth") &&
            this.configuration.data.backendextensions.google_oauth.config != null) {
            gapi.load('auth2', () => {
                let calendar_config = JSON.parse(
                    this.configuration.data.backendextensions.google_oauth.config.calendarconfig
                );
                this.clientId = calendar_config.web.client_id;
                this.auth2 = gapi.auth2.init({
                    client_id: this.clientId,
                    cookiepolicy: 'single_host_origin',
                    scope: this.scope
                });

                this.visible = true;
            });
        }
    }

    public signInClick() {
        Promise.resolve(this.auth2.signIn())
            .then((googleUser) => {
                let user_token = googleUser.getAuthResponse().id_token;
                let access_token = googleUser.getAuthResponse().access_token;
                this.loginService.oauthToken = user_token;
                this.loginService.accessToken = access_token;
                this.session.authData.sessionId = user_token;
                this.loginService.login();
            })
            .catch((error: { error: string }) => {
                console.log(JSON.stringify(error, undefined, 2));
            });
    }

}