/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: "user-changepassword-modal",
    templateUrl: "./src/modules/users/templates/userchangepasswordmodal.html"
})
export class UserChangePasswordModal {

    private currentPassword: string = "";
    private newPassword: string = "";
    private repeatPassword: string = "";
    private pwdCheck: RegExp = new RegExp("//");
    private pwdGuideline: string = "";
    private infoLoaded = false;
    private repFieldVisited = false;

    /**
     * reference toe hte modal itself
     */
    public self: any = undefined;

    /**
     * indicates that the modalis posting
     * @private
     */
    private posting: boolean = false;

    constructor( private language: language, private session: session, private backend: backend, private toast: toast, private configuration: configurationService ) { }

    public ngOnInit() {
        this.getInfo();
    }

    get pwderror() {
        return !this.newPassword || !this.pwdCheck.test(this.newPassword) ? false : this.language.getLabel("MSG_PWD_NOT_LEGAL");
    }

    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : this.language.getLabel("MSG_PWDS_DONT_MATCH"); // does not match password
    }

    /**
     * close the modal
     * @private
     */
    private close(): void {
        this.self.destroy();
    }

    /**
     * check if the user can save the new password
     * @private
     */
    private canSave(): boolean {
        return this.currentPassword && this.newPassword && this.pwderror === false && this.newPassword !== this.currentPassword && this.pwdreperror === false;
    }

    /**
     * save the changes
     * @private
     */
    private save(): void {
        if ( !this.canSave() ) { return; }
        let postData = {
            currentpwd: this.currentPassword,
            newpwd: this.newPassword
        };
        this.posting = true;
        this.backend.postRequest("user/password/change", {}, postData).subscribe(res => {
            if(res.status === "success"){
                this.toast.sendToast(this.language.getLabel("MSG_PWD_CHANGED_SUCCESSFULLY"));
                this.close();
            } else {
                this.toast.sendToast( this.language.getLabel("ERR_CHANGING_PWD"), "error", this.language.getLabel( res.lbl ), 10 );
                this.posting = false;
            }
        });
    }

    private getInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp('/' + extConf.regex + '/');

        let requArray = [];
        if(extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if(extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if(extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if(extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');
    }

}
