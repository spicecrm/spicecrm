import {
    Component
} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {cookie} from '../../services/cookie.service';
import {language} from '../../services/language.service';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var _: any;

@Component({
    selector: 'global-login',
    templateUrl: './src/globalcomponents/templates/globallogin.html',
    host: {
        '(window:keypress)': 'this.keypressed($event)'
    }
})
export class GlobalLogin {
    promptUser: boolean = false;

    username: string = '';
    password: string = '';
    private _selectedlanguage: string = '';
    selectedsite: string = '';
    lastSelectedLanguage: string = null;

    showForgotPass: boolean = false;

    externalSidebarUrl: SafeResourceUrl = null;

    constructor(private loginService: loginService,
                private http: HttpClient,
                private configuration: configurationService,
                private session: session,
                private cookie: cookie,
                private language: language,
                private sanitizer: DomSanitizer
    ) {
        if (sessionStorage['OAuth-Token'] && sessionStorage['OAuth-Token'].length > 0) {
            let headers = new HttpHeaders();
            headers = headers.set('OAuth-Token', sessionStorage['OAuth-Token']);

            // let backendurl = this.configuration.getBackendUrl();
            //if(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':backendurl')])
            //    backendurl = atob(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':backendurl')]);

            if (sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')])
                this.configuration.setSiteID(atob(sessionStorage[btoa(sessionStorage['OAuth-Token'] + ':siteid')]));


            this.http.get(this.configuration.getBackendUrl() + '/login', {
                headers: headers
            }).subscribe(
                (res: any) => {
                    var repsonse = res;
                    this.session.authData.sessionId = repsonse.id;
                    this.session.authData.userId = repsonse.userid;
                    this.session.authData.userName = repsonse.user_name;
                    this.session.authData.first_name = repsonse.first_name;
                    this.session.authData.last_name = repsonse.last_name;
                    this.session.authData.display_name = repsonse.display_name;
                    this.session.authData.email = repsonse.email;
                    this.session.authData.admin = repsonse.admin == 1 ? true : false;
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
        } else {
            this.promptUser = true;

            this.selectedsite = this.cookie.getValue('spiceuibackend');
            if (this.selectedsite)
                this.configuration.setSiteID(this.selectedsite);
        }

        this.lastSelectedLanguage = this.cookie.getValue('spiceuilanguage');

    }


    keypressed(event) {
        if (event.keyCode === 13 && !this.showForgotPass && !this.session.authData.renewPass) {
            this.login();
        }
    }

    login() {
        if (this.username.length > 0 && this.password.length > 0) {
            this.loginService.authData.userName = this.username;
            this.loginService.authData.password = this.password;
            this.loginService.login();
        }
    }


    set selectedlanguage(value){
        this._selectedlanguage = value;
        this.language.currentlanguage = value;
    }

    get selectedlanguage() {
        if ( ! this._selectedlanguage ) {
            if ( this.lastSelectedLanguage ) {
                this.selectedlanguage = this.lastSelectedLanguage;
            } else if ( this.configuration.data.languages ) {
                this.selectedlanguage = this.configuration.data.languages.default;
            }
        }
        return this._selectedlanguage;
    }

    getLanguages() {
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

    doLogin(){
        this.loginService.login();
    }

    get currentSiteId() {
        return this.configuration.data.id;
    }

    get sites() {
        return this.configuration.sites;
    }

    getBackendUrls() {
        if (this.configuration.data.backendUrls) {
            return this.configuration.data.backendUrls;
        } else {
            return [];
        }
    }

    setSite(event) {
        this.configuration.setSiteID(event.srcElement.value);
    }

    showForgotPassword() {
        if (this.showForgotPass) {
            this.showForgotPass = false;
        } else {
            this.showForgotPass = true;
        }
    }

    get showExternalSidebar() {
        try {
            let ret = !_.isEmpty(this.configuration.data.loginSidebarUrl);
            if (ret && this.externalSidebarUrl === null)
                this.externalSidebarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.configuration.data.loginSidebarUrl);
            return ret;
        } catch(e){
            return false;
        }
    }

    get showNewsfeed() {
        try {
            if (!this.configuration.initialized) return false;
            return _.isEmpty(this.configuration.data.loginSidebarUrl);
        } catch(e){
            return false;
        }
    }

    get showProgressBar() {
        return this.configuration.data.loginProgressBar;
    }

}