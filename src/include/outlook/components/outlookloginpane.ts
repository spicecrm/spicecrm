/**
 * @module Outlook
 */
import {
    Component, OnInit,
    // ChangeDetectorRef, Renderer2
} from '@angular/core';
import {Router} from '@angular/router';
import {loginService} from '../../../services/login.service';
import {configurationService} from '../../../services/configuration.service';
import {session} from '../../../services/session.service';
import {cookie} from '../../../services/cookie.service';
// import {language} from '../../services/language.service';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
// import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';

import {OutlookConfiguration} from '../services/outlookconfiguration.service';

declare var _: any;

@Component({
    selector: 'outlook-login-pane',
    templateUrl: './src/include/outlook/templates/outlookloginpane.html'
})
export class OutlookLoginPane implements OnInit {

    private promptUser: boolean = false;

    private username: string = '';
    private password: string = '';
    private _selectedlanguage: string = '';
    private selectedsite: string = '';
    private lastSelectedLanguage: string = null;
    private showForgotPass: boolean = false;

    constructor(
        private router: Router,
        private outlookConfiguration: OutlookConfiguration,

        private loginService: loginService,
        private http: HttpClient,
        private configuration: configurationService,
        private session: session,
        private cookie: cookie,
        // private language: language,
        // private sanitizer: DomSanitizer,
        // private changeDetectorRef: ChangeDetectorRef
    ) {
        if (sessionStorage['OAuth-Token'] && sessionStorage['OAuth-Token'].length > 0) {
            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', sessionStorage['OAuth-Token']);


            if (sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]) {
                this.configuration.setSiteID(atob(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]));
            }

            this.http.get(this.configuration.getBackendUrl() + '/login', {
                headers
            }).subscribe(
                (res: any) => {
                    let repsonse = res;
                    this.session.authData.sessionId = repsonse.id;
                    this.session.authData.userId = repsonse.userid;
                    this.session.authData.userName = repsonse.user_name;
                    this.session.authData.userimage = repsonse.user_image;
                    this.session.authData.first_name = repsonse.first_name;
                    this.session.authData.last_name = repsonse.last_name;
                    this.session.authData.display_name = repsonse.display_name;
                    this.session.authData.email = repsonse.email;
                    this.session.authData.admin = repsonse.admin == 1 ? true : false;
                    this.session.authData.dev = repsonse.dev == 1 ? true : false;
                    this.session.authData.renewPass = repsonse.renewPass === '1' ? true : false;

                    // set the backendurl
                    // this.configuration.data.backendUrl = backendurl;

                    if (!this.session.authData.renewPass) {
                        this.loginService.load();
                    }
                },
                (err: any) => {
                    switch (err.status) {
                        case 401:
                            this.promptUser = true;
                            break;
                    }
                });
        } else if (this.outlookConfiguration.hasSettings()) {
            this.username = this.outlookConfiguration.username;
            this.password = this.outlookConfiguration.password;
            this.login();
        } else {
            this.goToSettings();
        }

        // check the last selected language from the Cookie
        this.lastSelectedLanguage = this.cookie.getValue('spiceuilanguage');
    }

    public ngOnInit(): void {
        // if(this.configuration.hasSettings()) {
        //     this.router.navigate(['mailitem']);
        // } else {
        //     this.router.navigate(['settings']);
        // }
    }

    /**
     * triggers the actual login itself
     */
    private login() {
        console.log('Logging in from Outlook add-in');
        if (this.username.length > 0 && this.password.length > 0) {
            this.loginService.authData.userName = this.username;
            this.loginService.authData.password = this.password;
            this.loginService.login().subscribe(
                (res) => {
                    this.outlookConfiguration.username = this.loginService.authData.userName;
                    this.outlookConfiguration.password = this.loginService.authData.password;
                    this.outlookConfiguration.saveSettings();
                },
                (err) => {
                    console.log(err);
                    this.goToSettings();
                }
            );
        }
    }

    private goToSettings() {
        this.promptUser = true;

        this.selectedsite = this.cookie.getValue('spiceuibackend');
        if (this.selectedsite) {
            this.configuration.setSiteID(this.selectedsite);
        }
    }
}

//
//
//
// export class GlobalLogin {
//
//     constructor(private loginService: loginService,
//                 private http: HttpClient,
//                 private configuration: configurationService,
//                 private session: session,
//                 private cookie: cookie,
//                 private language: language,
//                 private sanitizer: DomSanitizer,
//                 private changeDetectorRef: ChangeDetectorRef
//     ) {

//
//     }
//
//     /**
//      * registerd to the resize event that handles if the news feed shoudl be shown or not
//      */
//     private handleResize() {
//         this.changeDetectorRef.detectChanges();
//     }
//
//
//     /**
//      * setter for the selected language
//      *
//      * @param value the language code
//      */
//     set selectedlanguage(value) {
//         this._selectedlanguage = value;
//         this.language.currentlanguage = value;
//     }
//
//     /**
//      * getter for the selected language
//      */
//     get selectedlanguage() {
//         if (!this._selectedlanguage) {
//             if (this.lastSelectedLanguage) {
//                 this.selectedlanguage = this.lastSelectedLanguage;
//             } else if (this.configuration.data.languages) {
//                 this.selectedlanguage = this.configuration.data.languages.default;
//             }
//         }
//         return this._selectedlanguage;
//     }
//
//     /**
//      * returns the available languages for the chosen backend system
//      */
//     private getLanguages() {
//         let langArray = [];
//
//         if (this.configuration.data.languages) {
//             // this.selectedlanguage = this.configuration.data.languages.default;
//             for (let language of this.configuration.data.languages.available) {
//                 langArray.push({
//                     language: language.language_code,
//                     text: language.language_name
//                 });
//             }
//         }
//         return langArray;
//     }
//
//     /**
//      * private function that actually does the login is user data is set
//      */
//     private doLogin() {
//         this.loginService.login();
//     }
//
//     /**
//      * returns thecurrent site id from the configuration service
//      */
//     get currentSiteId() {
//         return this.configuration.data.id;
//     }
//
//     /**
//      * helpe to retrieve all available sites from teh configuration service
//      */
//     get sites() {
//         return this.configuration.sites;
//     }
//
//     private getBackendUrls() {
//         if (this.configuration.data.backendUrls) {
//             return this.configuration.data.backendUrls;
//         } else {
//             return [];
//         }
//     }
//
//     /**
//      * setter for the new site id. This sets the site id in the configuration service and triggers detection of the baakcned extensions, languages and capabilities
//      *
//      * @param event
//      */
//     private setSite(event) {
//         this.configuration.setSiteID(event.srcElement.value);
//     }
//
//     /**
//      * toggles the forgotten password screen elements
//      */
//     private showForgotPassword() {
//         if (this.showForgotPass) {
//             this.showForgotPass = false;
//         } else {
//             this.showForgotPass = true;
//         }
//     }
//
//     /**
//      * a helper functions that returns if the sidebar in teh login screen shoudl be shown or not
//      */
//     get showSidebar() {
//         return window.innerWidth >= 1024;
//     }
//
//     /**
//      * a helper to return if the content of the sidebar shoudl be rendered as default or if the extenrla sidebar shoudl be shown.
//      *
//      * an external diebar can be added if in the config fot the site the property loginSidebarUrl is set and points to an URL. that url is loaded in teh sidebar in an iframe
//      */
//     get showExternalSidebar() {
//         try {
//             let ret = !_.isEmpty(this.configuration.data.loginSidebarUrl);
//             if (ret && this.externalSidebarUrl === null) {
//                 this.externalSidebarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.configuration.data.loginSidebarUrl);
//             }
//             return ret;
//         } catch (e) {
//             return false;
//         }
//     }
//
//     get showNewsfeed() {
//         try {
//             if (!this.configuration.initialized) {
//                 return false;
//             }
//             return _.isEmpty(this.configuration.data.loginSidebarUrl);
//         } catch (e) {
//             return false;
//         }
//     }
//
//     get showProgressBar() {
//         return this.configuration.data.loginProgressBar;
//     }
// }
