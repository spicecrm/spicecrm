/**
 * @module ModuleUsers
 */
import {ChangeDetectorRef, Component, OnInit, SkipSelf, ViewChild, ViewContainerRef} from "@angular/core";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";
import {helper} from '../../../services/helper.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: "../templates/useraddmodal.html",
    providers: [model, view]
})
export class UserAddModal implements OnInit {
    @ViewChild("addcontainer", {read: ViewContainerRef, static: true}) public addcontainer: ViewContainerRef;
    public self: any;
    public informationFieldset: any[] = [];
    public profileFieldset: any[] = [];
    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;

    public password: string;
    public repeatPassword: string;
    public pwdCheck: RegExp = new RegExp("//");
    public userNameCheck: RegExp = new RegExp("^(?![_.])(?!.*[_.]{2})[@a-zA-Z0-9._-]{1,60}$");
    public pwdGuideline: string;
    public autogenerate: boolean = false;
    public sendByEmail: boolean = false;
    public forceReset: boolean = true;
    public showPassword: boolean = false;
    public saveTriggered: boolean = false;
    public canSendByEmail: boolean = true;

    constructor(
        public language: language,
        public model: model,
        @SkipSelf() public parent: model,
        public modelutilities: modelutilities,
        public toast: toast,
        public backend: backend,
        public view: view,
        public cdr: ChangeDetectorRef,
        public metadata: metadata,
        public configuration: configurationService,
        public helper: helper
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
        if (!this.autoGenerate && this.pwdGuideline && this.pwdNotMatchGuide) {
            isValid = false;
        }
        if (!this.autoGenerate && (!this.password || this.rePwdNotSame)) {
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
        if ( value ) {
            this.password = this.helper.generatePassword(this.configuration.getCapabilityConfig('userpassword'));
            this.repeatPassword = this.password;
        }
    }

    public ngOnInit() {
        this.model.initialize(this.parent);
        this.model.setFields({
            UserType: "RegularUser",
            status: "Active",
        })
        this.getFieldSets();
        this.getPassInfo();
    }

    public getFieldSets() {
        let conf = this.metadata.getComponentConfig("UserAddModal", "Users");
        this.profileFieldset = conf && conf.profile ? conf.profile : this.profileFieldset;
        this.informationFieldset = conf && conf.information ? conf.information : this.informationFieldset;
    }


    public toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    public getPassInfo() {
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];
        if(extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if(extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if(extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if(extConf.onespecial) requArray.push(this.language.getLabel('MSG_PASSWORD_ONESPECIAL'));
        if(extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');

    }

    public copyPassword() {
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

    public cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    public save(goDetail: boolean = false) {
        this.saveTriggered = true;
        if (this.hasError) {
            return;
        }

        this.model.setFields({
            system_generated_password: this.autoGenerate,
            pwd_last_changed: new moment()
        });
        let saveData = this.modelutilities.spiceModel2backend("Users", this.model.data);

        this.backend.postRequest("module/Users/" + this.model.id, {}, JSON.stringify(saveData))
            .subscribe(
                response => {
                    for (let fieldName in response) {
                        if (response.hasOwnProperty(fieldName)) {
                            response[fieldName] = this.modelutilities.backend2spice("Users", fieldName, response[fieldName]);
                        }
                    }
                    this.model.setData(response);
                    this.model.endEdit();
                    this.savePassword(goDetail);
                },
                resErr => {
                    if (resErr.error.error.message) {
                        this.addcontainer.element.nativeElement.scrollTop = 0;
                        if(resErr.error.error.errorCode == 'duplicateUsername') {
                            this.model.setFieldMessage("error", resErr.error.error.message, "user_name", "validation");
                        }
                        if(resErr.error.error.errorCode == 'duplicateEmail1') {
                            this.model.setFieldMessage("error", resErr.error.error.message, "email1", "validation");
                        }
                    }
                });
    }

    public savePassword(goDetail) {
        let body = {
            newPassword: this.password,
            forceReset: this.forceReset,
            sendEmail: this.canSendByEmail ? this.sendByEmail : false
        };
        this.backend.postRequest("module/Users/"+this.model.id+"/password/reset", {}, body).subscribe(res => {
                if (this.sendByEmail) {
                    this.toast.sendToast(this.language.getLabel("MSG_NEW_PASSWORD_EMAIL_SENT"), "success", "", 10);
                } else {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"), "success");
                }
                if (goDetail) {
                    this.model.goDetail();
                }
                this.self.destroy();
        }, error => {
            this.sendByEmail = false;
            this.canSendByEmail = false;
            this.toast.sendToast(this.language.getLabel("MSG_PASSWORD_RESET_FAILED"), "error");
        });
    }
}
