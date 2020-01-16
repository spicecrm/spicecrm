/**
 * @module GlobalComponents
 */
import {HttpClient} from "@angular/common/http";
import {AfterViewInit, Component, ElementRef, EventEmitter, Output} from "@angular/core";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {libloader} from "../../services/libloader.service";
import {Observable, Subject} from "rxjs";

/**
 * @ignore
 */
declare var gapi: any;

/**
 * a login button that triggers the authentication via Google if that is enabled for the system
 */
@Component({
    selector: "global-login-google",
    templateUrl: "./src/globalcomponents/templates/globallogingoogle.html"
})
export class GlobalLoginGoogle {

    // private clientId: string = "";

    /**
     * determines if the buitton is rendered or not
     */
    private visible: boolean = false;

    /**
     * if the button is disabled .. while the libraries are loading
     */
    private disabled: boolean = true;

    private scope = [
        "profile",
        "email",
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/contacts.readonly",
        "https://www.googleapis.com/auth/admin.directory.user.readonly",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/tasks",
    ].join(" ");

    public auth2: any;

    constructor(
        private backend: backend,
        private configuration: configurationService,
        private http: HttpClient,
        private loginService: loginService,
        private session: session,
        private libloader: libloader
    ) {
        // listen to config changes and trigger the initialization
        this.configuration.loaded$.subscribe((loaded) => {
            this.googleInit();
        });
    }

    public googleInit() {
        if (this.configuration.data.backendextensions.hasOwnProperty("google_oauth") &&
            this.configuration.data.backendextensions.google_oauth.config != null) {

            this.libloader.loadFromSource(["https://apis.google.com/js/api.js", "https://apis.google.com/js/platform.js"]).subscribe(
                success => {
                    // load the google API
                    gapi.load("auth2", () => {
                        let calendar_config = JSON.parse(
                            this.configuration.data.backendextensions.google_oauth.config.calendarconfig
                        );
                        // this.clientId = calendar_config.web.client_id;
                        this.auth2 = gapi.auth2.init({
                            client_id: calendar_config.web.client_id,
                            cookiepolicy: "single_host_origin",
                            scope: this.scope
                        });

                        this.visible = true;

                        this.disabled = false;
                    });
                },
                error => {
                    this.disabled = true;
                    console.log('Error loading Google Libs');
                });
        } else {
            this.visible = false;
        }
    }

    public signInClick(event) {
        event.preventDefault();
        event.stopPropagation();
        Promise.resolve(this.auth2.signIn())
            .then((googleUser) => {
                let user_token = googleUser.getAuthResponse().id_token;
                let access_token = googleUser.getAuthResponse().access_token;
                this.loginService.oauthToken = user_token;
                this.loginService.accessToken = access_token;
                this.loginService.authData.userName = "";
                this.loginService.authData.password = "";
                // this.session.authData.sessionId = user_token;
                this.loginService.login().subscribe(
                    (res) => {
                        this.synchronize();
                    },
                    (err) => {
                        console.log(err);
                    },
                );
            })
            .catch((error: { error: string }) => {
                console.log(JSON.stringify(error, undefined, 2));
            });
    }

    public synchronize() {
        this.backend.getRequest('/google/calendar/sync').subscribe(
            (res) => {
                console.log('Successfully Synchronized');
            },
            (err) => {
                console.log('Synchronization Error');
            },
        );
    }
}
