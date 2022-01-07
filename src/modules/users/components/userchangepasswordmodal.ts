/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * a modal allowing th euser to change the password.
 * this runs outside of the backend service and requests direct http to be in line with the call from the login
 * the request is sent qizthout authentication
 */
@Component({
    selector: "user-changepassword-modal",
    templateUrl: "../templates/userchangepasswordmodal.html"
})
export class UserChangePasswordModal {

    /**
     * the current password
     *
     * @private
     */
    public password: string = "";

    /**
     * the new password
     * @private
     */
    public newPassword: string = "";

    /**
     * the new password repeated
     * @private
     */
    public repeatPassword: string = "";

    /**
     * a regex for the password check that is built from the password requirements
     * @private
     */
    public pwdCheck: RegExp = new RegExp("//");

    /**
     * the password guideline in human readable format
     * @private
     */
    public pwdGuideline: string = "";

    /**
     * indicates that the user has reentered the password
     * this is used to enhance usability and not fire the repeat password error
     * also when the user has not yet reentered the password
     *
     * @private
     */
    public repFieldVisited = false;

    /**
     * reference to the modal itself
     */
    public self: any = undefined;

    /**
     * indicates that the modal is posting
     * @private
     */
    public posting: boolean = false;

    constructor(public http: HttpClient, public language: language, public session: session, public toast: toast, public configuration: configurationService) {
    }

    public ngOnInit() {
        this.getInfo();
    }

    /**
     * simple getter for the password error
     */
    get pwderror() {
        return !this.newPassword || this.pwdCheck.test(this.newPassword) ? false : this.language.getLabel("MSG_PWD_NOT_LEGAL");
    }

    /**
     * simple getter if the repeated password does not match the initial one
     */
    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : this.language.getLabel("MSG_PWDS_DONT_MATCH"); // does not match password
    }

    /**
     * close the modal
     * @private
     */
    public close(): void {
        this.self.destroy();
    }

    /**
     * check if the user can save the new password
     * @private
     */
    public canSave(): boolean {
        return this.password && this.newPassword && this.pwderror === false && this.newPassword !== this.password && this.pwdreperror === false;
    }

    /**
     * save the changes
     * post unauthorized direct via http
     *
     * @private
     */
    public save(): void {
        if (this.canSave()) {
            this.http.post(this.configuration.getBackendUrl() + '/authentication/changepassword', {
                username: this.session.authData.userName,
                password: this.password,
                newPassword: this.newPassword
            }).subscribe(
                (res) => {
                    this.toast.sendToast(this.language.getLabel("MSG_PWD_CHANGED_SUCCESSFULLY"), 'success');
                    this.close();
                },
                (err: any) => {
                    this.toast.sendToast(this.language.getLabel("ERR_CHANGING_PWD"), "error", null, 10);
                    this.posting = false;
                }
            );
        }
    }

    /**
     * fetches and builds the infor for the password requirement
     *
     * @private
     */
    public getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];
        if (extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if (extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if (extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if (extConf.onespecial) requArray.push(this.language.getLabel('MSG_PASSWORD_ONESPECIAL'));
        if (extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

}
