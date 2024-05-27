import {Component, ComponentRef, Injector} from '@angular/core';
import {modal} from "../../services/modal.service";
import {
    TOTPAuthenticationGenerateModal
} from "../../include/totpauthentication/components/totpauthenticationgeneratemodal";
import {GlobalLogin} from "./globallogin";
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";

@Component({
    selector: 'global-login-2fa-method-select-modal',
    templateUrl: '../templates/globallogin2famethodselectmodal.html'
})

export class GlobalLogin2FAMethodSelectModal {
    /**
     * holds the available 2fa methods
     */
    public methods: { value: string, label: string, address: string }[] = [];
    /**
     * reference to this component to enable destroy
     */
    public self: ComponentRef<GlobalLogin2FAMethodSelectModal>;

    public selectedMethod: 'one_time_password' | 'sms' | 'email';

    public credentials: {username: string, password: string};

    constructor(private modal: modal,
                private injector: Injector,
                private backend: backend,
                private toast: toast,
                private loginComponent: GlobalLogin) {
    }

    /**
     * destroy the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * confirm the changes
     */
    public confirm() {

        switch (this.selectedMethod) {
            case 'one_time_password':
                this.modal.openStaticModal(TOTPAuthenticationGenerateModal, true, this.injector).subscribe(
                    ref => {
                        ref.instance.credentials = this.credentials;
                        ref.instance.onValidationSuccess.subscribe(() => {
                            this.loginComponent.code2fa = ref.instance.code;
                            this.loginComponent.twoFactorAuthCodeRequired = true;
                            this.loginComponent.login();
                            this.close();
                        })
                    }
                );
                break;
            case 'sms':
            case 'email':
                this.sendCode();
                break;

        }
    }

    /**
     * send the 2fa code to user
     * @private
     */
    private sendCode() {
        const sending = this.modal.await('LBL_SENDING');

        this.backend.postRequest(`authentication/2fa/${this.selectedMethod}/send`, null, this.credentials).subscribe({
            next: () => {
                sending.next(true); sending.complete();
                this.toast.sendToast('LBL_SENT', 'success');
                this.validateCode();
                },
            error: () => {
                sending.next(true); sending.complete();
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });
    }

    /**
     * validate the 2fa code input by user
     * @private
     */
    private validateCode() {

        this.modal.input('LBL_ENTER_CODE', 'LBL_CODE').subscribe(code => {

            if (!code) return;

            const validating = this.modal.await('LBL_VALIDATING');

            this.backend.postRequest(`authentication/2fa/${this.selectedMethod}/validate/${code}`, null, this.credentials).subscribe({
                next: () => {
                    validating.next(true); validating.complete();
                    this.loginComponent.code2fa = code;
                    this.loginComponent.twoFactorAuthCodeRequired = true;
                    this.loginComponent.login();
                    this.close();
                },
                error: () => {
                    validating.next(true); validating.complete();
                    this.toast.sendToast('LBL_INVALID_CODE', 'error');
                    this.validateCode();
                }
            });
        });
    }
}