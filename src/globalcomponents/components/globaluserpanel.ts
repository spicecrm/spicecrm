/**
 * @module GlobalComponents
 */
import {Router} from "@angular/router";
import {Component, EventEmitter, Output, ViewChild, ViewContainerRef} from "@angular/core";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {modal} from "../../services/modal.service";
import {userpreferences} from '../../services/userpreferences.service';
import {toast} from '../../services/toast.service';
import {socket} from '../../services/socket.service';

declare var _: any;

/**
 * the gloabl user panale rendered when the users clicks ont eh iamge or avatar in the top right corner
 */
@Component({
    selector: "global-user-panel",
    templateUrl: "../templates/globaluserpanel.html",
})
export class GlobaUserPanel {

    /**
     * emits that the popup shoudl be closed
     */
    @Output()public closepopup: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
       public loginService: loginService,
       public session: session,
       public router: Router,
       public metadata: metadata,
       public backend: backend,
       public config: configurationService,
       public modal: modal,
       public userprefs: userpreferences,
       public toast: toast,
       public socket: socket
    ) {

    }

   public logoff() {
        this.loginService.logout();
    }

   public changeImage() {
        this.modal.openModal("SystemUploadImage").subscribe(componentref => {
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

    get displayName() {
        return this.session.authData.display_name ? this.session.authData.display_name : this.session.authData.userName;
    }

    /**
     * returns the username
     */
    get userName() {
        return this.session.authData.userName;
    }

    /**
     * returns the systemname or the tenanat name if the user is logged in a tenant
     */
    get systemName() {
        return this.session.authData.tenant_name ? this.session.authData.tenant_name : this.config.systemName;
    }

    /**
     * returns if the user can change the password
     */
    get canChangePassword() {
        return this.session.authData.canchangepassword;
    }

    /**
     * navigates to the users detail page
     *
     * @private
     */
   public goDetails() {
        this.router.navigate(["/module/Users/" + this.session.authData.userId]);
        this.close();
    }

    /**
     * triggers the change password dialog
     *
     * @private
     */
   public changePassword() {
        if(this.canChangePassword) {
            this.modal.openModal("UserChangePasswordModal");
        }
    }

    /**
     * returns the user image to display in the user panel
     */
    get userimage() {
        return this.session.authData.userimage;
    }

    /**
     * changes the users timezone
     *
     * @param value
     * @private
     */
   public set currentTz(value) {
        if (this.userprefs.unchangedPreferences.global && this.userprefs.unchangedPreferences.global.timezone === value) return;
        this.userprefs.setPreference('timezone', value, true).subscribe((data: any) => {
            this.toast.sendToast('Timezone set successfully to "' + data.timezone + '".', 'success');
        }, error => {
            this.toast.sendToast('Error setting timezone.', 'error');
        });
        this.session.setTimezone(value); // Let the UI together with all the models and components know about the new configured timezone.
        this.close();
    }

    /**
     * loads the current timezone
     *
     * @private
     */
   public get currentTz(): string {
        if (this.userprefs.unchangedPreferences && this.userprefs.unchangedPreferences.global) {
            return this.userprefs.unchangedPreferences.global.timezone;
        } else {
            return '';
        }
    }

    /**
     * closes the popup
     */
   public close() {
        this.closepopup.emit(true);
    }

}
