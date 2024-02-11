/**
 * @module ModuleUsers
 */
import {ChangeDetectorRef, Component, OnInit, SkipSelf, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";
import {helper} from '../../../services/helper.service';
import {session} from "../../../services/session.service";
import {modal} from "../../../services/modal.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'user-set-2fa-modal',
    templateUrl: "../templates/userset2famodal.html"
})
export class UserSet2FAModal  {

    public self: any;

    public user_2fa_method: string;

    public capabilityConfig: any;

    constructor(
        public config: configurationService,
        public session: session,
        public modal: modal,
        public backend: backend
    ) {
        this.capabilityConfig = this.config.getCapabilityConfig('login');

        if(this.currentMethod) this.user_2fa_method = this.currentMethod;
    }

    get smsEnabled(){
        return this.capabilityConfig.twofactor.sms;
    }
    get emailEnabled(){
        return this.capabilityConfig.twofactor.email;
    }

    get candelete(){
        return !this.capabilityConfig.twofactor.onlogin.enforced;
    }

    get currentMethod(){
        return !!this.session.authData.user.user_2fa_method ? this.session.authData.user.user_2fa_method : 'none';
    }

    get phoneMobile(){
        return this.session.authData.user.phone_mobile;
    }

    get email(){
        return this.session.authData.user.email1;
    }

    public close(){
        this.self.destroy();
    }

    get canSave(){
        return this.user_2fa_method != this.currentMethod;
    }

    public save(){
        switch (this.user_2fa_method){
            case 'one_time_password':
                this.modal.openModal('TOTPAuthenticationGenerateModal');
                this.close();
                break;
            case 'sms':
            case 'email':
                let awaitModal = this.modal.await('LBL_SENDING_TOKEN');
                this.backend.getRequest(`authentication/2fa/${this.user_2fa_method}`).subscribe({
                    next: (res) => {
                        awaitModal.emit(true);
                        this.validate2FAToken();
                    },
                    error: () => {
                        awaitModal.emit(true);
                        this.close();
                    }
                })
                break;
            case 'none':
                // in case of email or SMS send a 2FA code
                if(this.currentMethod == 'sms' || this.currentMethod == 'email'){
                    let awaitModal = this.modal.await('LBL_SENDING_TOKEN');
                    this.backend.getRequest(`authentication/2fa/${this.currentMethod}`).subscribe({
                        next: (res) => {
                            awaitModal.emit(true);
                            this.delete2FASettings();
                        },
                        error: () => {
                            awaitModal.emit(true);
                            this.close();
                        }
                    })
                } else {
                    this.delete2FASettings();
                }
                break;
        }
    }

    public validate2FAToken(){
        this.modal.prompt('input', 'MSG_ENTER_FA_TOKEN','MSG_ENTER_FA_TOKEN').subscribe({
            next: (token) => {
                if(token) {
                    let awaitModal = this.modal.await('LBL_VALIDATING');
                    this.backend.putRequest(`authentication/2fa/${this.user_2fa_method}/${token}`).subscribe({
                        next: (res) => {
                            awaitModal.emit(true);
                            if(res.success) {
                                this.session.authData.user.user_2fa_method = this.user_2fa_method;
                                this.close();
                            } else {
                                this.validate2FAToken();
                            }
                        },
                        error: (e) => {
                            awaitModal.emit(true);
                            this.validate2FAToken();
                        }
                    })
                } else {
                    this.close();
                }
            }
        })
    }

    public delete2FASettings(){
        this.modal.prompt('input', 'MSG_ENTER_FA_TOKEN','MSG_ENTER_FA_TOKEN').subscribe({
            next: (token) => {
                if(token) {
                    let awaitModal = this.modal.await('LBL_DELETING');
                    this.backend.deleteRequest(`authentication/2fa/${token}`).subscribe({
                        next: (res) => {
                            awaitModal.emit(true);
                            if(res.success) {
                                this.session.authData.user.user_2fa_method = undefined;
                                this.close();
                            } else {
                                this.delete2FASettings();
                            }
                        },
                        error: (e) => {
                            awaitModal.emit(true);
                            this.delete2FASettings();
                        }
                    })
                } else {
                    this.close();
                }
            }
        })
    }

}
