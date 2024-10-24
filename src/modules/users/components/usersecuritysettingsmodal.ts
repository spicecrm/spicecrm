import {Component, ComponentRef} from '@angular/core';
import {ModalComponentI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {session} from "../../../services/session.service";
import {configurationService} from "../../../services/configuration.service";
import {GlobalLoginChangePassword} from "../../../globalcomponents/components/globalloginchangepassword";
import {modal} from "../../../services/modal.service";
import {
    TOTPAuthenticationGenerateModal
} from "../../../include/totpauthentication/components/totpauthenticationgeneratemodal";
import {model} from "../../../services/model.service";
import {GlobalLoginPasskeyModal} from "../../../globalcomponents/components/globalloginpasskeymodal";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {firstValueFrom} from "rxjs";

@Component({
    selector: 'user-security-settings-modal',
    templateUrl: '../templates/usersecuritysettingsmodal.html'
})

export class UserSecuritySettingsModal implements ModalComponentI{
    /**
     * reference of this component
     */
    public self: ComponentRef<UserSecuritySettingsModal>;
    /**
     * user active login methods
     */
    public activeMethods: {
        change_pass: { disabled: boolean, metadata?: {last_changed: string} };
        one_time_password: { active: boolean; disabled: boolean, metadata?: {name: string, icon_light: string} };
        passkey?: { active: boolean; metadata?: {name: string, icon_dark: string, icon_light: string} };
        sms?: { active: boolean; disabled: boolean, metadata?: any };
        email?: { active: boolean; disabled: boolean, metadata?: any }
    };
    /**
     * system default method
     */
    public systemDefaultMethod: 'user_defined' | 'one_time_password' | 'email' | 'sms';

    constructor(private session: session,
                private modal: modal,
                public model: model,
                private toast: toast,
                private backend: backend,
                private config: configurationService) {
        this.initializeActiveMethods();
        this.getUserActiveMethods();
        this.checkPasskeyRegistration();
    }

    /**
     * set default method
     * @param method
     */
    public setDefaultMethod(method: 'email' | 'sms' | 'one_time_password') {
        this.model.startEdit();
        this.model.data.user_2fa_method = method;
        this.model.save();
    }

    /**
     * get user active methods
     * @private
     */
    private getUserActiveMethods() {
        this.backend.getRequest(`authentication/2fa/${this.model.id}/activeLoginMethods`).subscribe({
            next: methods => {
                methods.forEach(m => {
                    if (!this.activeMethods[m]) return;
                    this.activeMethods[m].active = true;
                })
            }
        });
    }

    /**
     * initialize active methods
     */
    private initializeActiveMethods() {
        let config = this.config.getCapabilityConfig('login');
        this.systemDefaultMethod = config.twofactor.onlogin?.method;
        const is2FAEnabled = this.session.authData.canchangepassword && (!config.twofactor.onlogin.enforced || !this.systemDefaultMethod || this.systemDefaultMethod == 'user_defined');

        this.activeMethods = {
            one_time_password: {
                active: false, disabled: is2FAEnabled,
                metadata: {
                    icon_light: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNy40LjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBiYXNlUHJvZmlsZT0iYmFzaWMiIGlkPSJMYXllcl8xIg0KCSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iIzFBNzNFOCIgZD0iTTQ0MCwyNTUuOTk5OTd2MC4wMDAwNkM0NDAsMjczLjEyMDg1LDQyNi4xMjA4NSwyODcsNDA5LjAwMDAzLDI4N0gzMDJsLTQ2LTkzLjAxMDAxbDQ5LjY1MDctODUuOTk1MQ0KCWM4LjU2MDIxLTE0LjgyNjI5LDI3LjUxODM0LTE5LjkwNjUsNDIuMzQ1MTgtMTEuMzQ3MjRsMC4wMDU4NiwwLjAwMzRjMTQuODI3NzYsOC41NTk3OSwxOS45MDg3NSwyNy41MTkyOCwxMS4zNDg1Nyw0Mi4zNDY4Mg0KCUwzMDkuNzAwMDEsMjI1aDk5LjMwMDAyQzQyNi4xMjA4NSwyMjUsNDQwLDIzOC44NzkxNyw0NDAsMjU1Ljk5OTk3eiIvPg0KPHBhdGggZmlsbD0iI0VBNDMzNSIgZD0iTTM0OC4wMDE3NCw0MTUuMzQ4OTdsLTAuMDA1ODYsMC4wMDMzOWMtMTQuODI2ODQsOC41NTkyNy0zMy43ODQ5NywzLjQ3OTAzLTQyLjM0NTE4LTExLjM0NzIzTDI1NiwzMTguMDEwMDENCglsLTQ5LjY1MDY1LDg1Ljk5NTA5Yy04LjU2MDIsMTQuODI2MjktMjcuNTE4MzQsMTkuOTA2NTItNDIuMzQ1MTcsMTEuMzQ3MjlsLTAuMDA1OTEtMC4wMDM0Mg0KCWMtMTQuODI3NzctOC41NTk3OC0xOS45MDg3NS0yNy41MTkyOS0xMS4zNDg1OS00Mi4zNDY4M0wyMDIuMjk5OTksMjg3TDI1NiwyODVsNTMuNzAwMDEsMmw0OS42NTAzLDg2LjAwMjE0DQoJQzM2Ny45MTA0OSwzODcuODI5NjgsMzYyLjgyOTUsNDA2Ljc4OTE4LDM0OC4wMDE3NCw0MTUuMzQ4OTd6Ii8+DQo8cGF0aCBmaWxsPSIjRkJCQzA0IiBkPSJNMjU2LDE5My45ODk5OUwyNDIsMjMybC0zOS43MDAwMS03bC00OS42NTAzLTg2LjAwMjEyDQoJYy04LjU2MDE3LTE0LjgyNzU1LTMuNDc5MTktMzMuNzg3MDUsMTEuMzQ4NTktNDIuMzQ2ODRsMC4wMDU5MS0wLjAwMzQxYzE0LjgyNjgzLTguNTU5MjUsMzMuNzg0OTctMy40NzkwMyw0Mi4zNDUxNywxMS4zNDcyNg0KCUwyNTYsMTkzLjk4OTk5eiIvPg0KPHBhdGggZmlsbD0iIzM0QTg1MyIgZD0iTTI0OCwyMjVsLTM2LDYySDEwMi45OTk5N0M4NS44NzkxNiwyODcsNzIsMjczLjEyMDg1LDcyLDI1Ni4wMDAwM3YtMC4wMDAwNg0KCUM3MiwyMzguODc5MTcsODUuODc5MTYsMjI1LDEwMi45OTk5NywyMjVIMjQ4eiIvPg0KPHBvbHlnb24gZmlsbD0iIzE4NURCNyIgcG9pbnRzPSIzMDkuNzAwMDEsMjg3IDIwMi4yOTk5OSwyODcgMjU2LDE5My45ODk5OSAiLz4NCjwvc3ZnPg0K',
                    name: 'Google Authenticator'
                }
            },
            change_pass: {
                disabled: !this.session.authData.canchangepassword,
                metadata: {
                    last_changed: `${this.modal.language.getLabel('LBL_CHANGED')} ${this.model.userpreferences.formatDate(this.model.data.pwd_last_changed)}`
                }
            }
        };

        if (navigator.credentials && navigator.credentials.create) {
            this.activeMethods.passkey = {active: false};
        }

        if (config.twofactor.email) {
            this.activeMethods.email = {active: false, disabled: is2FAEnabled};
        }

        if (config.twofactor.sms) {
            this.activeMethods.sms = {active: false, disabled: is2FAEnabled};
        }
    }

    /**
     * check passkey registration
     * @private
     */
    private checkPasskeyRegistration() {

        const loadingModal = this.modal.await('LBL_LOADING');

        this.backend.getRequest('authentication/passkey/' + this.session.authData.userId, {rpId: window.location.hostname}).subscribe({
            next: res => {

                loadingModal.next(true);
                loadingModal.complete();
                if (!res) return;

                this.activeMethods.passkey.active =  true;
                this.activeMethods.passkey.metadata = res;
            },
            error: () => {
                loadingModal.next(true);
                loadingModal.complete();
            }
        });
    }

    /**
     * open change password modal
     */
    public openChangePasswordModal() {
        this.modal.openStaticModal(GlobalLoginChangePassword, true);
    }

    /**
     * activate method
     */
    public activate(method: 'one_time_password' | 'email' | 'sms' | 'passkey') {
        switch (method) {
            case 'passkey':
                this.modal.openStaticModal(GlobalLoginPasskeyModal, true).subscribe(modalRef => {
                    modalRef.instance.onSuccess$.subscribe(() =>
                        this.activeMethods.passkey.active = true
                    )
                });
                break;
            case 'one_time_password':
                this.modal.openStaticModal(TOTPAuthenticationGenerateModal, true).subscribe(modalRef => {
                    modalRef.instance.onBehalfUserId = this.model.id;
                    modalRef.instance.onValidationSuccess.subscribe(() =>
                        this.activeMethods.one_time_password.active = true
                    );
                });
                break;
            case 'email':
                if (!this.model.data.email1) {
                    this.toast.sendToast('MSG_EMAIL_ADDRESS_REQUIRED');
                } else {
                    this.send2FARegistrationCode('email');
                }
                break;
            case 'sms':
                if (!this.model.data.phone_mobile) {
                    this.toast.sendToast('MSG_MOBILE_PHONE_REQUIRED');
                } else {
                    this.send2FARegistrationCode('sms');
                }
                break;
        }
    }

    /**
     * deactivate method
     * @param method
     */
    public async deactivate(method: 'one_time_password' | 'email' | 'sms' | 'passkey') {

        const confirm = await firstValueFrom(this.modal.confirmDeleteRecord());

        if (!confirm) return;

        const loadingModal = this.modal.await('LBL_DELETING');

        switch (method) {
            case 'passkey':
                this.backend.deleteRequest('authentication/passkey/' + this.session.authData.userId, {rpId: window.location.hostname}).subscribe({
                    next: () => {
                        this.activeMethods.passkey.active = false;
                        this.activeMethods.passkey.metadata = undefined;
                        loadingModal.next(true);
                        loadingModal.complete();
                    },
                    error: () => {
                        loadingModal.next(true);
                        loadingModal.complete();
                    }
                });
                break;
            case 'one_time_password':
                this.delete2FASettings(method);
                break;
            case 'email':
            case 'sms':
                this.backend.getRequest(`authentication/2fa/${method}`).subscribe({
                    next: () => {
                        loadingModal.next(true);
                        loadingModal.complete();
                        this.delete2FASettings(method);
                    },
                    error: () => {
                        loadingModal.next(true);
                        loadingModal.complete();
                    }
                });
                break;
        }

    }

    /**
     * delete 2fa settings
     * @private
     */
    private delete2FASettings(method: 'sms' | 'email' | 'one_time_password'){
        this.modal.prompt('input', 'MSG_ENTER_FA_TOKEN','MSG_ENTER_FA_TOKEN').subscribe({
            next: (token) => {
                if(!token) return;
                const loadingModal = this.modal.await('LBL_DELETING');
                this.backend.deleteRequest(`authentication/2fa/${method}/${token}`).subscribe({
                    next: (res) => {
                        loadingModal.next(true);
                        loadingModal.complete();
                        if (res.success) {
                            this.activeMethods[method].active = false;
                            this.session.authData.user.user_2fa_method = undefined;
                        } else {
                            this.delete2FASettings(method);
                        }
                    },
                    error: () => {
                        loadingModal.next(true);
                        loadingModal.complete();
                        this.delete2FASettings(method);
                    }
                });
            }
        })
    }


    /**
     * send 2fa registration code to the user using the given method
     * @param method
     * @private
     */
    private send2FARegistrationCode(method: 'email' | 'sms') {

        const loadingModal = this.modal.await('LBL_SENDING_TOKEN');

        this.backend.getRequest(`authentication/2fa/${method}`).subscribe({
            next: () => {
                loadingModal.next(true);
                loadingModal.complete();
                this.validate2FARegistrationCode(method);
            },
            error: () => {
                loadingModal.next(true);
                loadingModal.complete();
            }
        });
    }

    /**
     * validate 2fa code
     * @param method
     */
    public validate2FARegistrationCode(method: 'email' | 'sms'){
        this.modal.prompt('input', 'MSG_ENTER_FA_TOKEN','MSG_ENTER_FA_TOKEN').subscribe({
            next: (token) => {
                if(!token) return;
                let awaitModal = this.modal.await('LBL_VALIDATING');
                this.backend.putRequest(`authentication/2fa/${method}/${token}`).subscribe({
                    next: (res) => {
                        awaitModal.next(true);
                        awaitModal.complete();
                        if (res.success) {
                            this.activeMethods[method].active = true;
                            this.session.authData.user.user_2fa_method = method;
                        } else {
                            this.validate2FARegistrationCode(method);
                        }
                    },
                    error: () => {
                        awaitModal.next(true);
                        awaitModal.complete();
                        this.validate2FARegistrationCode(method);
                    }
                });
            }
        })
    }


    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}