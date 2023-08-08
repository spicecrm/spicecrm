import {Component} from '@angular/core';
import {backend} from "../../services/backend.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";

//test 6

@Component({
    selector: 'git-pull-from-repository',
    templateUrl: '../templates/gitpullfromrepository.html'
})
export class GitPullFromRepository {

    /**
     * form of login chosen by user
     * username / token
     */
    public loginFormChosen =
        [{label: 'username', value: 'username'}, {label: 'token', value: 'token'}];
    /**
     * details for logging in
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
    public gitHubTokenRegexp: RegExp = new RegExp("^ghp_[a-zA-Z0-9]{36}$");
    public userRegexp: RegExp = new RegExp("^[a-zA-Z0-9-]+$");
    public emailRegexp: RegExp = new RegExp("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$");

    constructor(public backend: backend, public toast: toast, public modal: modal) {

    }

    /**
     * check that login details are correct
     */
    public loginCheck() {
        this.passwordCondition = this.loginDetails.password.length > 0 && this.pwRegexp.test(this.loginDetails.password);
        this.tokenCondition = this.loginDetails.token.length > 0  && (this.gitHubTokenRegexp.test(this.loginDetails.token)||this.pwRegexp.test(this.loginDetails.token));
        this.usernameCondition = this.userRegexp.test(this.loginDetails.username) || this.emailRegexp.test(this.loginDetails.username);
    }

    /**
     * pull from repository
     * @param loginDetails
     */
    public pullFromRepository(loginDetails) {
        this.loginCheck();

        if (this.loginDetails.loginOption == 'token') {
            if (this.tokenCondition) {
                let loadingModal = this.modal.await('LBL_LOADING');
                delete this.loginDetails.username;
                delete this.loginDetails.password;
                delete this.loginDetails.loginOption;
                this.backend.postRequest(`admin/repair/pull`, null, loginDetails).subscribe((res: any) => {
                    this.data = res.output;
                    loadingModal.emit(true);
                    this.toast.sendToast('LBL_DATA_SAVED', 'success');
                });
            } else if (!this.tokenCondition) {
                this.toast.sendToast('token is empty or incorrect', 'error');
            }
        } else if (this.loginDetails.loginOption == 'username') {
            if (this.usernameCondition && this.passwordCondition) {
                let loadingModal = this.modal.await('LBL_LOADING');
                this.backend.postRequest(`admin/repair/pull`, null, loginDetails).subscribe((res: any) => {
                    this.data = res.output;
                    loadingModal.emit(true);
                    this.toast.sendToast('LBL_DATA_SAVED', 'success');
                });
            } else if (!this.usernameCondition && !this.passwordCondition) {
                this.toast.sendToast('username and password is empty or incorrect', 'error');
            } else if (!this.usernameCondition) {
                this.toast.sendToast('username is empty or incorrect', 'error');
            } else if (!this.passwordCondition) {
                this.toast.sendToast('password is empty or incorrect', 'error');
            }
        }
    }
}