import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";

declare var moment: any;

@Component({
    templateUrl: "./src/modules/users/templates/useraddmodal.html",
    providers: [model, view]
})
export class UserAddModal implements OnInit, AfterViewChecked {
    public self: any;
    @ViewChild("addcontainer", {read: ViewContainerRef}) private addcontainer: ViewContainerRef;
    private componentconfig: any = {};
    public informationFieldset: any[] = [];
    public profileFieldset: any[] = [];
    private response: Observable<object> = null;
    private responseSubject: Subject<any> = null;
    private expanded: any = {profile: true, password: true, info: true};

    private password: string = undefined;
    private repeatPassword: string = undefined;
    private pwdCheck: RegExp = new RegExp("//");
    private userNameCheck: RegExp = new RegExp("^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{1,60}$");
    private pwdGuideline: string = undefined;
    private infoLoaded = false;
    private autogenerate: boolean = false;
    private sendByEmail: boolean = false;
    private showPassword: boolean = false;
    private saveTriggered: boolean = false;
    private canSendByEmail: boolean = true;

    constructor(
        private language: language,
        private model: model,
        private modelutilities: modelutilities,
        private toast: toast,
        private backend: backend,
        private view: view,
        private cdr: ChangeDetectorRef,
        private metadata: metadata,
    ) {
        this.model.module = "Users";
        this.view.isEditable = true;
        this.view.setEditMode();
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    get pwderror() {
        return this.password && !this.pwdCheck.test(this.password) ? "Password does not match the Guideline." : false;
    }

    get pwdreperror() {
        return this.password == this.repeatPassword ? false : "Inputs for the new Password does not match."; // does not match password
    }

    get saveData() {
        let saveData: any = {};
        for (let fieldName in this.model.data) {
            if (this.model.data.hasOwnProperty(fieldName)) {
                saveData[fieldName] = this.modelutilities.spice2backend("Users", fieldName, this.model.data[fieldName]);

            }
        }
        return saveData;
    }

    set autoGenerate(value) {
        this.autogenerate = value;
        this.password = value ? Math.random().toString(36).slice(-8) : "";
        this.repeatPassword = this.password;
    }

    get autoGenerate() {
        return this.autogenerate;
    }

    public ngOnInit() {
        let guid = this.model.generateGuid();
        this.model.id = guid;
        this.model.data.id = guid;
        this.model.data.UserType = "RegularUser";
        this.model.data.status = "Active";
        this.getComponentConfig();
        this.getInfo();
    }

    public ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    private getComponentConfig() {
        this.componentconfig = this.metadata.getComponentConfig("UserAddModal", "Users");
        if (this.componentconfig.profile) {
            this.profileFieldset = this.componentconfig.profile;
        }
        if (this.componentconfig.information) {
            this.informationFieldset = this.componentconfig.information;
        }
    }

    private getPasswordStyle(inputField, isRepeat = false) {
        return !this.autoGenerate && (inputField.touched && inputField.dirty && (isRepeat ? this.pwdreperror : this.pwderror)) ||
        ((isRepeat ? !this.repeatPassword : !this.password) && this.saveTriggered) ? 'slds-has-error' : '';
    }

    private toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    private copyPassword() {
        if (!this.autoGenerate) {return;}

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

    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private onModalEscX() {
        this.cancel();
    }

    private togglePanel(panel) {
        this.expanded[panel] = !this.expanded[panel];
    }

    private getTabStyle(tab) {
        if (!this.expanded[tab]) {
            return {
                height: "0px",
                transform: "rotateX(90deg)"
            };
        }
    }

    private save(goDetail: boolean = false) {
        this.saveTriggered = true;
        this.setDefaultModelData();
        if (!this.checkErrors()) {
            return false;
        }
        this.backend.postRequest("module/Users/" + this.model.id, {}, JSON.stringify(this.saveData))
            .subscribe(
                response => {
                    for (let fieldName in response) {
                        if (response.hasOwnProperty(fieldName)) {
                            response[fieldName] = this.modelutilities.backend2spice("Users", fieldName, response[fieldName]);
                        }
                    }
                    this.model.data = response;
                    this.model.endEdit();
                    this.savePassword(goDetail);
                },
                resErr => {
                    if (resErr.error.error.message) {
                        this.addcontainer.element.nativeElement.scrollTop = 0;
                        this.model.setFieldMessage("error", resErr.error.error.message, "email1", "validation");
                    }
                });
    }

    private setDefaultModelData() {
        this.model.data.system_generated_password = this.autoGenerate;
        this.model.data.date_entered = new moment();
        this.model.data.date_modified = new moment();
        this.model.data.pwd_last_changed = new moment();
    }

    private checkErrors() {
        if (this.autoGenerate) {return true;}
        let isValid = true;
        if (this.infoLoaded && this.pwderror) {
            isValid = false;
        }
        if (!this.password || this.pwdreperror) {
            isValid = false;
        }

        if (!this.model.validate()) {
            isValid = false;
        }

        if (this.model.data.user_name && !this.userNameCheck.test(this.model.data.user_name)) {
            this.model.setFieldMessage("error", "Only characters A-Z, a-z, numbers 1-9, dot, and underscore.", "user_name", "validation");
            isValid = false;
        }
        return isValid;
    }

    private savePassword(goDetail) {
        let body = {
            newpwd: this.password,
            userId: this.model.id,
            SystemGeneratedPassword: this.autoGenerate,
            sendByEmail: this.sendByEmail
        }
        this.backend.postRequest("user/password/new", {}, body).subscribe(res => {
            if (res.status) {
                if (this.sendByEmail) {
                    this.toast.sendToast("An Email with the new password was successfully sent, check your inbox", "success", "", 10);
                } else {
                    this.toast.sendToast("Data saved", "success");
                }

                if (goDetail) {
                    this.model.goDetail();
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
            this.toast.sendToast("Email couldn't be send. Check Mailbox Settings.", "error");
        });
    }
}
