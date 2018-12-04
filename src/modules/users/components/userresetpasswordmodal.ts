import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {session} from "../../../services/session.service";

@Component({
    selector: "user-reset-password-modal",
    templateUrl: "./src/modules/users/templates/userresetpasswordmodal.html"
})
export class UserResetPasswordModal {

    public self: any = undefined;
    public userId: string = '';
    private password: string = undefined;
    private repeatPassword: string = undefined;
    private pwdCheck: RegExp = new RegExp("//");
    private pwdGuideline: string = undefined;
    private infoLoaded = false;
    private autogenerate: boolean = false;
    private sendByEmail: boolean = false;
    private showPassword: boolean = false;
    private passwordErrorMsg: string = "";
    private repeatPasswordErrorMsg: string = "";
    private canSendByEmail: boolean = true;

    constructor(
        private language: language,
        private modelutilities: modelutilities,
        private toast: toast,
        private session: session,
        private backend: backend,
    ) {}

    get passwordError() {
        let boolean = !this.autoGenerate && this.password && !this.pwdCheck.test(this.password);
        this.passwordErrorMsg = boolean ? "Password does not match the Guideline." : "";
        return boolean;
    }

    get repeatPasswordError() {
        let boolean = !this.autoGenerate && this.repeatPassword && this.password !== this.repeatPassword;
        this.repeatPasswordErrorMsg = boolean ? "Inputs for the new Password does not match." : "";
        return boolean;
    }

    get autoGenerate() {
        return this.autogenerate;
    }

    set autoGenerate(value) {
        this.autogenerate = value;
        this.password = value ? Math.random().toString(36).slice(-8) : undefined;
        this.repeatPassword = this.password;
    }

    public ngOnInit() {
        this.getInfo();
    }


    private getPasswordStyle(touched, dirty, isRepeat = false) {
        return touched && dirty && ((isRepeat ? this.repeatPasswordError : this.passwordError)) ? 'slds-has-error' : '';
    }


    private toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    private copyPassword() {
        if (!this.autoGenerate) {
            return;
        }

        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.password;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toast.sendToast("Password copied", "success");
    }


    private getInfo() {
        this.backend.getRequest("user/password/info", {lang: this.language.currentlanguage}).subscribe((res: any) => {
            this.pwdCheck = new RegExp(res.pwdCheck.regex);
            this.pwdGuideline = res.pwdCheck.guideline;
            this.infoLoaded = true;
        });
    }

    private onModalEscX() {
        this.close();
    }

    private save() {
        if (!this.checkErrors() || !this.session.isAdmin) {
            return false;
        }
        this.backend.postRequest("user/password/new", {}, {
            newpwd: this.password,
            userId: this.userId,
            SystemGeneratedPassword: this.autoGenerate,
            sendByEmail: this.sendByEmail
        }).subscribe(res => {
            if (res.status) {
                if (this.sendByEmail) {
                    this.toast.sendToast("An Email with the new password was successfully sent, check your inbox", "success", "", 10);
                } else {
                    this.toast.sendToast("Data saved", "success");
                }

                this.self.destroy();
            } else {
                this.sendByEmail = false;
                this.canSendByEmail = false;
                this.toast.sendToast(res.message, "error");
            }
        }, error => {
            this.sendByEmail = false;
            this.canSendByEmail = false;
            this.toast.sendToast("Email couldn't be send. Check Mailbox Settings.", "error")
        });
    }

    private checkErrors() {
        if (this.autoGenerate) {
            return true;
        }
        let isValid = true;
        if (this.infoLoaded && this.passwordError) {
            isValid = false;
        }
        if (!this.password || this.repeatPasswordError) {
            isValid = false;
        }
        return isValid;
    }

    private close() {
        this.self.destroy();
    }
}
