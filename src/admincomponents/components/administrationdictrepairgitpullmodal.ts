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

    public loginDetails: any = {
        username: '',
        password: ''
    };

    public data: any;

    public passwordCondition: boolean = true;
    public usernameCondition: boolean = true;
    public emailCondition: boolean = true;

    /**
     * Regex for password
     */
    public pwRegexp: RegExp = new RegExp("^ghp_[a-zA-Z0-9]{36}$");
    public userRegexp: RegExp = new RegExp("^[a-zA-Z0-9]+$")
    public emailRegexp: RegExp = new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")

    constructor(public backend: backend, public toast: toast, public modal: modal) {

    }

    public pullFromRepository(loginDetails) {

        this.passwordCondition = this.loginDetails.password.length > 0 && this.pwRegexp.test(this.loginDetails.password);
        this.usernameCondition = this.loginDetails.username.length > 0 && this.userRegexp.test(this.loginDetails.username);
        this.emailCondition = this.loginDetails.username.length > 0 && this.emailRegexp.test(this.loginDetails.username);

        if (this.passwordCondition && this.usernameCondition || this.emailCondition && this.passwordCondition) {
            let loadingModal = this.modal.await('LBL_LOADING');
            this.backend.postRequest(`/admin/repair/pull`, null, loginDetails).subscribe((res: any) => {
                console.log(res);
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