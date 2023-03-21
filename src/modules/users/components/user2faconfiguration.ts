import {Component, ComponentRef, Injector, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {
    TOTPAuthenticationGenerateModal
} from "../../../include/totpauthentication/components/totpauthenticationgeneratemodal";

@Component({
    selector: 'user-2fa-configuration',
    templateUrl: '../templates/user-2fa-configuration.html',
    providers: [view]
})

export class User2FAConfiguration implements OnInit {
    /**
     * is loading boolean
     */
    public isLoading: boolean = false;
    /**
     * holds the available methods
     */
    public methods: {label: string, value: string}[] = [{label: 'LBL_TOTP_AUTHENTICATION', value: 'one_time_password'}];

    public system2FAConfig: { method: 'sms' | 'one_time_password' | 'email', require_on: 'always' | 'device_change' | '', mailbox_id: string };

    constructor(public model: model,
                private backend: backend,
                private toast: toast,
                private modal: modal,
                private language: language,
                private injector: Injector,
                public view: view) {
    }

    /**
     * load the 2FA config and set the view
     */
    public ngOnInit() {
        this.view.linkedToModel = true;
        this.view.isEditable = true;
        this.loadConfig();
    }

    /**
     * load the 2FA config
     */
    public loadConfig() {

        this.isLoading = true;

        this.backend.getRequest('configuration/configurator/editor/user_login_2fa')
            .subscribe(
                (response) => {

                    this.isLoading = false;

                    if (!!response.sms_mailbox_id) {
                        this.methods.push({label: 'LBL_SMS', value: 'sms'});
                    }

                    if (!!response.email_mailbox_id) {
                        this.methods.push({label: 'LBL_EMAIL', value: 'email'});
                    }

                    this.system2FAConfig = response;

                    if (!!this.system2FAConfig.require_on) {
                        this.view.isEditable = false;
                    }
                });
    }

    /**
     * save the method on the user
     */
    public save() {

        if (this.isLoading || !!this.system2FAConfig.require_on) return;

        this.model.save(true);
    }

    /**
     * handle the method change
     * @param method
     */
    public handleMethodChange(method: 'sms' | 'email' | 'one_time_password') {

        if (method == 'one_time_password') {
            this.handleOneTimePassword();
        }

        if (method == 'email' && !this.model.data.email1) {
            this.model.data.user_2fa_method = undefined;
            return this.toast.sendToast('MSG_EMAIL_ADDRESS_REQUIRED');
        }

        if (method == 'sms' && !this.model.data.phone_mobile) {
            this.model.data.user_2fa_method = undefined;

            return this.toast.sendToast('MSG_MOBILE_PHONE_REQUIRED');
        }
    }

    /**
     * generate one time password
     * @private
     */
    private handleOneTimePassword() {

        const loading = this.modal.await(this.language.getLabel('MSG_TOTP_STATUSCHECK'));

        this.backend.getRequest(`authentication/totp`, {onBehalfUserId: this.model.id}).subscribe({
            next:
                res => {
                    loading.emit(true);

                    if (!res.active) {
                        this.generateOneTimePassword();
                    }
                },
            error: () => {
                this.model.data.user_2fa_method = undefined;
                loading.emit(true);
            }
        });
    }

    /**
     * generate one-time password
     * @private
     */
    private generateOneTimePassword() {
        this.modal.openModal('TOTPAuthenticationGenerateModal', true, this.injector).subscribe(
            (modalRef: ComponentRef<TOTPAuthenticationGenerateModal>) => {
                modalRef.instance.onBehalfUserId = this.model.id;
                modalRef.instance.response.subscribe({
                    next: (success: boolean) => {
                        if (!success) {
                            this.model.data.user_2fa_method = undefined;
                        }
                    }
                })
            }
        );
    }
}