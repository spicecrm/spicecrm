/**
 * @module GlobalComponents
 */
import {Router} from "@angular/router";
import {Component, ComponentRef, EventEmitter, Output} from "@angular/core";
import {loginService} from "../../services/login.service";
import {session} from "../../services/session.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {modal} from "../../services/modal.service";
import {userpreferences} from '../../services/userpreferences.service';
import {toast} from '../../services/toast.service';
import {socket} from '../../services/socket.service';
import {language} from '../../services/language.service';
import {loader} from '../../services/loader.service';
import {UserPreferencesModal} from "../../modules/users/components/userpreferencesmodal";
import {
    TOTPAuthenticationGenerateModal
} from "../../include/totpauthentication/components/totpauthenticationgeneratemodal";
import {model} from "../../services/model.service";
import {UserSet2FAModal} from "../../modules/users/components/userset2famodal";
import {GlobalLoginChangePassword} from "./globalloginchangepassword";

declare var _: any;

/**
 * the gloabl user panale rendered when the users clicks ont eh iamge or avatar in the top right corner
 */
@Component({
    selector: "global-user-panel",
    templateUrl: "../templates/globaluserpanel.html",
    providers: [model]
})
export class GlobaUserPanel {

    /**
     * emits that the popup shoudl be closed
     */
    @Output()public closepopup: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * a boolean if the user can open the user details
     */
    public canOpenUser: boolean = false;

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
       public socket: socket,
       public language: language,
       public loader: loader,
       public model: model
    ) {
        // load the model from teh user data
        this.model.module = 'Users';
        this.model.id = this.session.authData.userId;
        this.model.setData(this.session.authData.user);
        this.canOpenUser = this.model.checkAccess('view');
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
                    let imagebackup = this.session.authData.user.user_image;
                    this.session.authData.user.user_image = '';
                    this.backend.postRequest('module/Users/' + this.session.authData.userId + '/image', {}, {imagedata: image}).subscribe(
                        response => {
                            this.session.authData.user.user_image = image;
                        },
                        error => {
                            this.session.authData.user.user_image = imagebackup;
                        });
                }
            });
        });
    }

    get displayName() {
        return this.session.authData.user.full_name ? this.session.authData.user.full_name : this.session.authData.userName;
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

    get canChange2fa(){
        let config = this.config.getCapabilityConfig('login');
        return this.canChangePassword && (!config.twofactor.onlogin.enforced || config.twofactor.onlogin.method == '' || config.twofactor.onlogin.method == 'user_defined');
    }

    /**
     * navigates to the users detail page
     *
     * @private
     */
   public goDetails() {
       if(this.canOpenUser) {
           this.router.navigate(["/module/Users/" + this.session.authData.userId]);
           this.close();
       }
    }

    /**
     * opens the user preferences Panel
     */
    public openPreferences() {
        this.modal.openModal('UserPreferencesModal');
    }

    /**
     * opens the signature modal
     */
    public editSignature() {
        this.modal.openModal('UserSignatureModal');
    }

    /**
     * triggers the change password dialog
     *
     * @private
     */
   public changePassword() {
        if(this.canChangePassword) {
            this.modal.openStaticModal(GlobalLoginChangePassword);
        }
    }

    /**
     * triggers the change password dialog
     *
     * @private
     */
    public change2FA() {
        let loading = this.modal.await(this.language.getLabel('MSG_TOTP_STATUSCHECK'));
        this.backend.getRequest(`authentication/totp`, {onBehalfUserId: this.session.authData.userId}).subscribe(
            res => {
                loading.emit(true);
                if (res.active) {
                    this.modal.confirm(this.language.getLabel('MSG_TOTP_DELETE', null, 'long'), this.language.getLabel('MSG_TOTP_DELETE')).subscribe(a => {
                        if (a) {
                            loading = this.modal.await(this.language.getLabel('MSG_TOTP_DELETING'));
                            this.backend.deleteRequest(`authentication/totp`, {onBehalfUserId: this.session.authData.userId}).subscribe({
                                next: (res) => {
                                    loading.emit(true);
                                    this.session.authData.user.user_2fa_method = undefined;
                                    this.generateTOTP();
                                },
                                error: () => {
                                    loading.emit(true);
                                }
                            });
                        }
                    });
                } else {
                    this.generateTOTP();
                }
            },
            () => {
                loading.emit(true);
            }
        );
    }



    public set2FA() {
        this.modal.openModal('UserSet2FAModal');
    }


    public generateTOTP() {
        this.modal.openModal('TOTPAuthenticationGenerateModal').subscribe(
            modalref => {
                modalref.instance.onBehalfUserId = this.session.authData.userId;
            }
        );
    }

    /**
     * returns the user image to display in the user panel
     */
    get userimage() {
        return this.session.authData.user.user_image;
    }

    // /**
    //  * @deprecated since 2023.03.001
    //  * returns if the logged in user is an admin
    //  */
    get displayDeveloperMode(){
        return this.session.authData.admin;
    }
    //
    // /**
    //  * @deprecated since 2023.03.001
    //  * returns if we can set the developermode
    //  */
    // get canSetDeveloperMode(){
    //     return this.config.data.systemparameters.developermode == '2';
    // }
    //
    // /**
    //  * @deprecated since 2023.03.001
    //  * gets the developermode
    //  */
    // get developermode(){
    //     return (this.config.data.systemparameters.developermode == '1' || this.config.data.systemparameters.developermode === true) || (this.canSetDeveloperMode && this.session.developerMode);
    // }
    //
    // /**
    //  * @deprecated since 2023.03.001
    //  * sets the developermode
    //  *
    //  * @param value
    //  */
    // set developermode(value){
    //     if(this.canSetDeveloperMode) this.session.developerMode = value;
    // }

    /**
     * changes the users timezone
     *
     * @param value
     * @private
     */
   public set currentTz(value) {
        if (this.userprefs.unchangedPreferences.global && this.userprefs.unchangedPreferences.global.timezone === value) return;
        this.userprefs.setPreference('timezone', value, true).subscribe((data: any) => {
            this.toast.sendToast(this.language.getLabel('LBL_TIMEZONE_WAS_SET_TO')+': '+data.timezone, 'success');
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
     * clears the cache
     */
    public clearCache(){
        this.modal.confirm('MSG_RESET_CACHE', 'MSG_RESET_CACHE').subscribe({
            next: (res) => {
                if (res) {
                    let loadingModal = this.modal.await('LBL_LOADING');
                    this.backend.deleteRequest('system/cache').subscribe(result => {
                        loadingModal.emit(true);
                        if(result) {
                            this.modal.openModal('GlobalHeaderReloadModal', false).subscribe(modalref => {
                                this.loader.load().subscribe((val) => {
                                    if (val === true) {
                                        this.toast.sendToast("LBL_DATA_RELOADED");
                                        modalref.instance.self.destroy();
                                    } else {
                                        this.toast.sendToast('error', 'error', 'Reload failed');
                                        modalref.instance.self.destroy();
                                    }
                                });
                            })
                        } else {
                            this.toast.sendToast('LBL_ERROR', 'error');
                        }
                    });
                }
            }
        })
    }

    /**
     * navigates to the admin section
     */
    public goAdmin(){
        this.router.navigate(['/admin']);
    }

    /**
     * closes the popup
     */
   public close() {
        this.closepopup.emit(true);
    }

}
