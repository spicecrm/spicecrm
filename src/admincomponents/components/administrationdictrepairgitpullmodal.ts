/**
 * @module AdminComponentsModule
 */
import {Component, ComponentRef} from '@angular/core';
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'administration-dict-repair-git-pull-modal',
    templateUrl: '../templates/administrationdictrepairgitpullmodal.html'
})
export class AdministrationDictRepairGitPullModal {

    /**
     * reference to the modal
     * @private
     */
    public self: ComponentRef<AdministrationDictRepairGitPullModal>;

    /**
     * form of login chosen by user in modal
     * username / tocken
     */
    public loginFormChosen =
        [{label: 'username', value: 'username'}, {label: 'token', value: 'token'}];
    /**
     * details for loging in
     */
    public loginDetails: any = {
        username: '',
        password: '',
        token: '',
        loginOption: 'token' || 'username'
    };

    public data: any;
    /**
     * conditions for login details
     */
    public passwordCondition: boolean = true;
    public tokenCondition: boolean = true;
    public usernameCondition: boolean = true;
    public emailCondition: boolean = true;

    /**
     * Regex for password
     */
    public pwRegexp: RegExp = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");
    public tokenRegexp: RegExp = new RegExp("^ghp_[a-zA-Z0-9]{36}$");
    public userRegexp: RegExp = new RegExp("^[a-zA-Z0-9]+$");
    public emailRegexp: RegExp = new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");

    constructor(public backend: backend, public toast: toast, public modal: modal) {

    }

    /**
     * pull from repository
     * @param loginDetails
     */
    public pullFromRepository(loginDetails) {

        /**
         * check that login details are correct
         */
        this.passwordCondition = this.loginDetails.password.length > 0 && this.pwRegexp.test(this.loginDetails.password);
        this.tokenCondition = this.loginDetails.token.length > 0 && this.tokenRegexp.test(this.loginDetails.token);
        this.usernameCondition = this.loginDetails.username.length > 0 && this.userRegexp.test(this.loginDetails.username);
        this.emailCondition = this.loginDetails.username.length > 0 && this.emailRegexp.test(this.loginDetails.username);
        /**
         * remove extra and empty values
         */
        if (this.passwordCondition && this.usernameCondition || this.emailCondition && this.passwordCondition || this.tokenCondition) {
            let loadingModal = this.modal.await('LBL_LOADING');
            delete loginDetails.loginOption;
            if (this.loginDetails.username === "" || this.loginDetails.password === "") {
                delete loginDetails.username;
                delete loginDetails.password;
            } else {
                delete loginDetails.token;
            }
            /**
             * post to backend and display result
             */
            this.backend.postRequest(`/admin/repair/pull`, null, loginDetails).subscribe((res: any) => {
                this.data = res.output;
                loadingModal.emit(true);
                this.toast.sendToast('LBL_DATA_SAVED', 'success');
            });
        } else if (!this.passwordCondition) {
            this.toast.sendToast('password is incorrect', 'error');

        } else if (!this.emailCondition || !this.usernameCondition) {
            this.toast.sendToast('username or email is incorrect', 'error');
        } else {
            this.toast.sendToast('LBL_ERROR', 'error');
        }
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }
}