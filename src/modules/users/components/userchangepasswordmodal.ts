/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {session} from "../../../services/session.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

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

    public self: any = undefined;

    constructor( private language: language, private session: session, private backend: backend, private toast: toast ) { }

    public ngOnInit() {
        this.getInfo();
    }

    get pwderror() {
        if ( !this.infoLoaded ) { return false;}
        return !this.newPassword || this.pwdCheck.test(this.newPassword) ? false : this.language.getLabel("MSG_PWD_NOT_LEGAL");
    }

    get pwdreperror() {
        return this.newPassword == this.repeatPassword ? false : this.language.getLabel("MSG_PWDS_DONT_MATCH"); // does not match password
    }

    private close() {
        this.self.destroy();
    }

    private canSave() {
        if ( !this.infoLoaded ) { return false;}
        return this.currentPassword && this.newPassword && this.pwderror === false && this.newPassword !== this.currentPassword && this.pwdreperror === false;
    }

    private save() {
        if ( !this.canSave() ) { return; }
        let postData = {
            currentpwd: this.currentPassword,
            newpwd: this.newPassword
        };
        this.backend.postRequest("user/password/change", {}, postData).subscribe(res => {
            if(res.status === "success"){
                this.toast.sendToast(this.language.getLabel("MSG_PWD_CHANGED_SUCCESSFULLY"));
                this.close()
            } else {
                this.toast.sendToast( this.language.getLabel("ERR_CHANGING_PWD"), "error", this.language.getLabel( res.lbl ), 10 );
            }
        });
    }

    private getInfo() {
        this.backend.getRequest("user/password/info", { lang: this.language.currentlanguage } ).subscribe( (res:any) => {
            this.pwdCheck = new RegExp( res.pwdCheck.regex );
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

}
