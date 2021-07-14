/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: "./src/modules/users/templates/useraddmodal.html",
    providers: [model, view]
})
export class UserAddModal implements OnInit {
    @ViewChild("addcontainer", {read: ViewContainerRef, static: true}) public addcontainer: ViewContainerRef;
    public self: any;
    public informationFieldset: any[] = [];
    public profileFieldset: any[] = [];
    private response: Observable<object> = null;
    private responseSubject: Subject<any> = null;

    private password: string;
    private repeatPassword: string;
    private pwdCheck: RegExp = new RegExp("//");
    private userNameCheck: RegExp = new RegExp("^(?![_.])(?!.*[_.]{2})[@a-zA-Z0-9._]{1,60}$");
    private pwdGuideline: string;
    private autogenerate: boolean = false;
    private sendByEmail: boolean = false;
    private showPassword: boolean = false;
    private saveTriggered: boolean = false;
    private canSendByEmail: boolean = true;

    constructor(
        private language: language,
        private model: model,
        @SkipSelf() private parent: model,
        private modelutilities: modelutilities,
        private toast: toast,
        private backend: backend,
        private view: view,
        private cdr: ChangeDetectorRef,
        private metadata: metadata,
        private configuration: configurationService
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
        this.password = value ? Math.random().toString(36).slice(-8) : '';
        this.repeatPassword = this.password;
    }

    public ngOnInit() {
        this.model.initialize(this.parent);
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
        let extConf = this.configuration.getCapabilityConfig('userpassword');
        this.pwdCheck = new RegExp(extConf.regex);

        let requArray = [];
        if(extConf.onelower) requArray.push(this.language.getLabel('MSG_PASSWORD_ONELOWER'));
        if(extConf.oneupper) requArray.push(this.language.getLabel('MSG_PASSWORD_ONEUPPER'));
        if(extConf.onenumber) requArray.push(this.language.getLabel('MSG_PASSWORD_ONENUMBER'));
        if(extConf.minpwdlength) requArray.push(this.language.getLabel('MSG_PASSWORD_LENGTH') + ' ' + extConf.minpwdlength);

        this.pwdGuideline = requArray.join(', ');

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
        if (this.hasError) {
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
            newPassword: this.password,
            forceReset: this.autoGenerate,
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
