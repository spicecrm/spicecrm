/**
 * @module GlobalComponents
 */
import {
    Component, ChangeDetectorRef, Renderer2
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {broadcast} from '../../services/broadcast.service';
import {cookie} from '../../services/cookie.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


/**
 * @ignore
 */
declare var _: any;

/**
 * the login component that is rendered on the login screen and prompts for usrname and password resp offers alternative login methods
 */
@Component({
    selector: 'global-login',
    templateUrl: './src/globalcomponents/templates/globallogin.html',
    host: {
        '(window:resize)': 'handleResize()'
    }
})
export class GlobalLogin {
    private promptUser: boolean = false;

    /**
     * the username
     */
    private username: string = '';

    /**
     * the password
     */
    private password: string = '';

    /**
     * variable for the selected language
     */
    private _selectedlanguage: string = '';

    /**
     * the selected site if multiple sites are available
     */
    private selectedsite: string = '';

    // the last selected language .. loaded from the cookie
    // ToDo: should be changed to local store
    private lastSelectedLanguage: string = null;

    /**
     * determine if the forgotten password is open or not
     */
    private showForgotPass: boolean = false;

    /**
     * variable to hold if per config the extenral side bar shoudl be shown
     * ToDo: move to separate component
     */
    private externalSidebarUrl: SafeResourceUrl = null;


    /**
     * the id of the last message if a toast was sent
     *
     * @private
     */
    private messageId: string;

    /**
     * indicator to show the new password dialog
     *
     * @private
     */
    private renewpassword: boolean = false;

    /**
     * inidcates that we are in the login process
     *
     * @private
     */
    private loggingIn: boolean = false;

    constructor(private loginService: loginService,
                private http: HttpClient,
                private configuration: configurationService,
                private session: session,
                private cookie: cookie,
                private toast: toast,
                private language: language,
                private broadcast: broadcast,
                private sanitizer: DomSanitizer,
                private changeDetectorRef: ChangeDetectorRef
    ) {
        if (sessionStorage['OAuth-Token']) {
            if (sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]) {
                this.configuration.setSiteID(atob(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]));
            }

            // try to login with the found token
            this.loginService.oauthToken = sessionStorage['OAuth-Token'];
            this.loginService.oauthIssuer = 'SpiceCRM';
            this.loginService.login().subscribe(
                res => {
                    this.broadcast.broadcastMessage('login');
                    this.loginService.load();
                },
                err => {
                    this.loginService.oauthToken = null;
                    this.loginService.oauthIssuer = null;
                    this.promptUser = true;
                }
            );
        } else {
            this.promptUser = true;

            this.selectedsite = this.cookie.getValue('spiceuibackend');
            if (this.selectedsite) {
                this.configuration.setSiteID(this.selectedsite);
            }
        }

        // check the last selected language from the Cookie
        this.lastSelectedLanguage = this.cookie.getValue('spiceuilanguage');

    }

    /**
     * registerd to the resize event that handles if the news feed shoudl be shown or not
     */
    private handleResize() {
        this.changeDetectorRef.detectChanges();
    }

    /**
     * triggers the actual login itself
     */
    private login(token?, issuer?) {

        if (token || (this.username && this.password)) {
            // clear the current messageid if one is set
            if (this.messageId) this.toast.clearToast(this.messageId);

            // clear all toasts
            this.toast.clearAll();

            // set the loggingin in state
            this.loggingIn = true;

            if(token) {
                this.loginService.authData.userName = null;
                this.loginService.authData.password = null;
                this.loginService.oauthToken = token;
                this.loginService.oauthIssuer = issuer;
            } else {
                this.loginService.authData.userName = this.username;
                this.loginService.authData.password = this.password;
                this.loginService.oauthToken = null;
                this.loginService.oauthIssuer = null;
            }
            this.loginService.login().subscribe(
                success => {
                    // clear all toasts
                    this.toast.clearAll();

                    // reset the logging in state
                    this.loggingIn = false;
                },
                error => {
                    switch (error.errorCode) {
                        // invalid password/user
                        case 1:
                            this.messageId = this.toast.sendToast('error logging on with username and password', 'error');
                            break;
                        // password expired
                        case 2:
                            this.renewpassword = true;
                            break;
                        default:
                            this.messageId = this.toast.sendToast('error logging on', 'error', error.message);
                            break;
                    }

                    // reset the logging in state
                    this.loggingIn = false;
                }
            );
        }
    }

    /**
     * setter for the selected language
     *
     * @param value the language code
     */
    set selectedlanguage(value) {
        this._selectedlanguage = value;
        this.language.currentlanguage = value;
    }

    /**
     * getter for the selected language
     */
    get selectedlanguage() {
        if (!this._selectedlanguage) {
            if (this.lastSelectedLanguage) {
                this.selectedlanguage = this.lastSelectedLanguage;
            } else if (this.configuration.data.languages) {
                this.selectedlanguage = this.configuration.data.languages.default;
            }
        }
        return this._selectedlanguage;
    }

    /**
     * returns the available languages for the chosen backend system
     */
    private getLanguages() {
        let langArray = [];

        if (this.configuration.data.languages) {
            // this.selectedlanguage = this.configuration.data.languages.default;
            for (let language of this.configuration.data.languages.available) {
                langArray.push({
                    language: language.language_code,
                    text: language.language_name
                });
            }
        }
        return langArray;
    }

    /**
     * only display the login image when the screenheight is large enough
     */
    get displayimage() {
        return window.innerHeight > 800;
    }

    /**
     * returns thecurrent site id from the configuration service
     */
    get currentSiteId() {
        return this.configuration.data.id;
    }

    /**
     * helpe to retrieve all available sites from teh configuration service
     */
    get sites() {
        return this.configuration.sites;
    }

    private getBackendUrls() {
        if (this.configuration.data.backendUrls) {
            return this.configuration.data.backendUrls;
        } else {
            return [];
        }
    }

    /**
     * setter for the new site id. This sets the site id in the configuration service and triggers detection of the baakcned extensions, languages and capabilities
     *
     * @param event
     */
    private setSite(event) {
        this.configuration.setSiteID(event.srcElement.value);
    }

    /**
     * toggles the forgotten password screen elements
     */
    private showForgotPassword() {
        if (this.showForgotPass) {
            this.showForgotPass = false;
        } else {
            this.showForgotPass = true;
        }
    }

    /**
     * a helper functions that returns if the sidebar in teh login screen shoudl be shown or not
     */
    get showSidebar() {
        return this.configuration.data.displayloginsidebar !== false && window.innerWidth >= 1024;
    }

    /**
     * a helper to return if the content of the sidebar shoudl be rendered as default or if the extenrla sidebar shoudl be shown.
     *
     * an external diebar can be added if in the config fot the site the property loginSidebarUrl is set and points to an URL. that url is loaded in teh sidebar in an iframe
     */
    get showExternalSidebar() {
        try {
            let ret = !_.isEmpty(this.configuration.data.loginSidebarUrl);
            if (ret && this.externalSidebarUrl === null) {
                this.externalSidebarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.configuration.data.loginSidebarUrl);
            }
            return ret;
        } catch (e) {
            return false;
        }
    }

    get showNewsfeed() {
        try {
            if (!this.configuration.initialized) {
                return false;
            }
            return _.isEmpty(this.configuration.data.loginSidebarUrl);
        } catch (e) {
            return false;
        }
    }

    get showProgressBar() {
        return this.configuration.data.loginProgressBar;
    }
}
