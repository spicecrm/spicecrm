/**
 * @module ModuleUsers
 */
import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: "./src/modules/users/templates/useraddmodal.html",
    providers: [model, view]
})
export class UserAddModal implements OnInit {
    @ViewChild("addcontainer", {read: ViewContainerRef, static: false}) public addcontainer: ViewContainerRef;
    public self: any;
    public informationFieldset: any[] = [];
    public profileFieldset: any[] = [];
    private response: Observable<object> = null;
    private responseSubject: Subject<any> = null;

    private password: string;
    private repeatPassword: string;
    private pwdCheck: RegExp = new RegExp("//");
    private userNameCheck: RegExp = new RegExp("^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{1,60}$");
    private pwdGuideline: string;
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

    get PwdFieldType() {
        return this.showPassword ? 'text' : 'password';
    }

    get modelOptions() {
        return {updateOn: 'blur'};
    }

    get passwordMsg() {
        if (this.pwdFieldEmpty) {
            return [{type: 'error', message: this.language.getLabel('MSG_INPUT_REQUIRED')}];
        } else if (this.pwdNotMatchGuide) {
            return [{type: 'error', message: this.language.getLabel('MSG_PWD_NOT_LEGAL')}];
        }
        return [];
    }

    get rePasswordMsg() {
        if (this.rePwdFieldEmpty) {
            return [{type: 'error', message: this.language.getLabel('MSG_INPUT_REQUIRED')}];
        } else if (this.rePwdNotSame) {
            return [{type: 'error', message: this.language.getLabel('MSG_PWDS_DONT_MATCH')}];
        }
        return [];
    }

    get pwdFieldEmpty() {
        return this.saveTriggered && !this.password;
    }

    get rePwdFieldEmpty() {
        return this.saveTriggered && !this.repeatPassword;
    }

    get pwdNotMatchGuide() {
        return !this.autoGenerate && this.password && !this.pwdCheck.test(this.password);
    }

    get rePwdNotSame() {
        return !this.autoGenerate && this.repeatPassword && this.password != this.repeatPassword;
    }

    get pwdFieldStyle() {
        return (this.pwdFieldEmpty || this.pwdNotMatchGuide) ? 'slds-has-error' : '';
    }

    get rePwdFieldStyle() {
        return (this.rePwdFieldEmpty || this.rePwdNotSame) ? 'slds-has-error' : '';
    }

    get hasError() {
        let isValid = true;
        if (this.pwdGuideline && this.pwdNotMatchGuide) {
            isValid = false;
        }
        if (!this.password || this.rePwdNotSame) {
            isValid = false;
        }

        if (!this.model.validate()) {
            isValid = false;
        }

        let userName = this.model.getField('user_name');

        if (userName && !this.userNameCheck.test(userName)) {
            this.model.setFieldMessage("error", this.language.getLabel("MSG_USERNAME_NOT_LEGAL"), "user_name", "validation");
            isValid = false;
        }
        return !isValid;
    }

    get autoGenerate() {
        return this.autogenerate;
    }

    set autoGenerate(value) {
        this.autogenerate = value;
        this.password = value ? Math.random().toString(36).slice(-8) : this.password;
        this.repeatPassword = this.password;
    }

    public ngOnInit() {
        this.model.initialize();
        this.model.data.UserType = "RegularUser";
        this.model.data.status = "Active";
        this.getFieldSets();
        this.getPassInfo();
    }

    private getFieldSets() {
        let conf = this.metadata.getComponentConfig("UserAddModal", "Users");
        this.profileFieldset = conf && conf.profile ? conf.profile : this.profileFieldset;
        this.informationFieldset = conf && conf.information ? conf.information : this.informationFieldset;
    }


    private toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    private getPassInfo() {
        let params = {lang: this.language.currentlanguage};
        this.backend.getRequest("user/password/info", params)
            .subscribe((res: any) => {
                if (!res || !res.pwdCheck) {
                    return;
                }
                this.pwdCheck = res.pwdCheck.regex ? new RegExp(res.pwdCheck.regex) : this.pwdCheck;
                this.pwdGuideline = res.pwdCheck.guideline ? res.pwdCheck.guideline : this.pwdGuideline;
            });
    }

    private copyPassword() {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.password;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        if (document.execCommand('copy')) {
            this.toast.sendToast(this.language.getLabel("MSG_PASSWORD_COPIED"), "success");
        }
        document.body.removeChild(selBox);
    }

    private cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    private save(goDetail: boolean = false) {
        this.saveTriggered = true;
        if (!this.autoGenerate && this.hasError) {
            return;
        }
        this.model.data.system_generated_password = this.autoGenerate;
        this.model.data.pwd_last_changed = new moment();
        let saveData = this.modelutilities.spiceModel2backend("Users", this.model.data);

        this.backend.postRequest("module/Users/" + this.model.id, {}, JSON.stringify(saveData))
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

    private savePassword(goDetail) {
        let body = {
            newpwd: this.password,
            userId: this.model.id,
            SystemGeneratedPassword: this.autoGenerate,
            sendByEmail: this.canSendByEmail ? this.sendByEmail : false
        };
        this.backend.postRequest("user/password/new", {}, body).subscribe(res => {
            if (res.status) {
                if (this.sendByEmail) {
                    this.toast.sendToast(this.language.getLabel("MSG_NEW_PASSWORD_EMAIL_SENT"), "success", "", 10);
                } else {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"), "success");
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
            this.toast.sendToast(this.language.getLabel("MSG_EMAIL_SEND_FAILED"), "error");
        });
    }
}
