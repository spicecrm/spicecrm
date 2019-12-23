/**
 * @module GlobalComponents
 */
import {Router} from "@angular/router";
import {Component, ViewChild, ViewContainerRef} from "@angular/core";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {popup} from "../../services/popup.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {modal} from "../../services/modal.service";
import {cookie} from "../../services/cookie.service";
import {userpreferences} from '../../services/userpreferences.service';
import {toast} from '../../services/toast.service';

declare var _: any;

@Component({
    selector: "global-user-panel",
    templateUrl: "./src/globalcomponents/templates/globaluserpanel.html",
})
export class GlobaUserPanel {

    @ViewChild("imgupload", {read: ViewContainerRef, static: true}) public imgupload: ViewContainerRef;
    private timezones: object;
    private timezoneKeys: string[];
    private isEditingTz = false;
    private compId: string = _.uniqueId();

    constructor(
        private loginService: loginService,
        private session: session,
        private router: Router,
        private popup: popup,
        private language: language,
        private metadata: metadata,
        private backend: backend,
        private config: configurationService,
        private modalservice: modal,
        private cookie: cookie,
        private userprefs: userpreferences,
        private toastservice: toast
    ) {

    }

    private logoff() {
        this.loginService.logout();
    }

    private changeImage() {
        this.modalservice.openModal("SystemUploadImage").subscribe(componentref => {
            componentref.instance.cropheight = 150;
            componentref.instance.cropwidth = 150;
            componentref.instance.imagedata.subscribe(image => {
                if (image !== false) {
                    // make a backup of the image, set it to emtpy and if case call fails set back the saved image
                    let imagebackup = this.session.authData.userimage;
                    this.session.authData.userimage = '';
                    this.backend.postRequest('module/Users/' + this.session.authData.userId + '/image', {}, {imagedata: image}).subscribe(
                        response => {
                            this.session.authData.userimage = image;
                        },
                        error => {
                            this.session.authData.userimage = imagebackup;
                        });
                }
            });
        });
    }

    private getAvialableLanguages() {
        return this.language.getAvialableLanguages(true);
    }

    get displayName() {
        return this.session.authData.display_name ? this.session.authData.display_name : this.session.authData.userName;
    }

    get userName() {
        return this.session.authData.userName;
    }

    get currentlanguage() {
        return this.language.currentlanguage;
    }

    set currentlanguage(value) {
        this.popup.close();
        this.language.currentlanguage = value;
        this.language.loadLanguage();
    }

    private goDetails() {
        this.popup.close();
        this.router.navigate(["/module/Users/" + this.session.authData.userId]);
    }

    private changePassword() {
        this.modalservice.openModal("UserChangePasswordModal");
    }

    get userimage() {
        return this.session.authData.userimage;
    }

    private set currentTz( value ) {
        if ( this.userprefs.unchangedPreferences.global && this.userprefs.unchangedPreferences.global.timezone === value ) return;
        this.userprefs.setPreference('timezone', value, true ).subscribe( ( data: any ) => {
            this.toastservice.sendToast('Timezone set successfully to "'+data.timezone+'".', 'success' );
        }, error => {
            this.toastservice.sendToast('Error setting timezone.', 'error' );
        });
        this.session.setTimezone( value ); // Let the UI together with all the models and components know about the new configured timezone.
        this.popup.close();
    }

    private get currentTz(): string {
        if ( this.userprefs.unchangedPreferences && this.userprefs.unchangedPreferences.global ) return this.userprefs.unchangedPreferences.global.timezone;
        else return '';
    }

}
