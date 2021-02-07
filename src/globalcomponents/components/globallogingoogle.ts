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

    @Input() private authenticatedUser: string;

    /**
     * determines if the buitton is rendered or not
     */
    private visible: boolean = false;

    /**
     * if the button is disabled .. while the libraries are loading
     */
    private disabled: boolean = true;

    /**
     * the google auth object
     */
    public auth2: any;

    /**
     * emits the token
     *
     * @private
     */
    @Output() private token: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private backend: backend,
        private configuration: configurationService,
        private http: HttpClient,
        private loginService: loginService,
        private session: session,
        private libloader: libloader,
        private toast: toast
    ) {
        // listen to config changes and trigger the initialization
        this.configuration.loaded$.subscribe((loaded) => {
            if (loaded) this.googleInit();
        });
    }

    /**
     * initialize and load the google libraries
     */
    public googleInit() {
        let config = this.configuration.getCapabilityConfig('google_oauth');
        if (config?.clientid) {
            this.visible = true;
            this.libloader.loadFromSource(["https://apis.google.com/js/platform.js"]).subscribe(
                success => {
                    // load the google API
                    gapi.load("auth2", () => {
                        this.auth2 = gapi.auth2.init({
                            client_id: config.clientid,
                            cookiepolicy: "single_host_origin"
                        });

                        // set visible and enable the button
                        this.disabled = false;

                        // run change detection
                        // this.changeDetectorRef.detectChanges();
                    });
                },
                error => {
                    this.disabled = true;
                }
            );
        }
    }

    /**
     * get the google token
     *
     * @param event
     */
    public signIn(event) {
        event.preventDefault();
        event.stopPropagation();
        Promise.resolve(this.auth2.signIn())
            .then((googleUser) => {
                let profileEmail = this.auth2.currentUser.get().getBasicProfile().getEmail();
                if (!this.authenticatedUser || (this.authenticatedUser && this.authenticatedUser == profileEmail)) {
                    this.token.emit(googleUser.getAuthResponse().id_token);
                } else if (this.authenticatedUser && this.authenticatedUser != profileEmail) {
                    this.toast.sendToast('Wrong username', 'warning', 'usernames do not match, pleas elogin with the proper user');
                }
            })
            .catch((error: { error: string }) => {
                this.toast.sendToast('Error with Google Login', 'error');
            });
    }
}
