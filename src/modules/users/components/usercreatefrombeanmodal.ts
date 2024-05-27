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
import {modal} from '../../../services/modal.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "usercreatefrombeanmodal",
    templateUrl: "../templates/usercreatefrombeanmodal.html",
    providers: [model, view]
})
export class UserCreateFromBeanModal implements OnInit {
    @ViewChild("addcontainer", {read: ViewContainerRef, static: true}) public addcontainer: ViewContainerRef;

    public self: any;

    public fieldset: string;
    public response: Observable<object> = null;
    public responseSubject: Subject<any> = null;

    // regex for the username
    public userNameCheck: RegExp = new RegExp("^(?![_.])(?!.*[_.]{2})[@a-zA-Z0-9._-]{1,60}$");

    // for the password handling
    public password: string;
    public sendByEmail: boolean = false;
    public forceReset: boolean = true;
    public systemGenerated: boolean = true;
    public externalAuthOnly: boolean = false;
    public canSendByEmail: boolean = true;

    public step: 'user'|'role'|'acl' = 'user';
    public steps:{value: 'user'|'role'|'acl', label: string}[] = [
        {
            value: 'user',
            label: 'LBL_USER'
        },
        {
            value: 'role',
            label: 'LBL_ROLE'
        },
        {
            value: 'acl',
            label: 'LBL_ACL'
        }
    ]

    public userRoles: any[] = [];

    public userProfiles: any[] = [];

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
        public modal: modal
    ) {
        this.model.module = "Users";
        this.view.isEditable = true;
        this.view.setEditMode();
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }


    get modelOptions() {
        return {updateOn: 'blur'};
    }


    get hasError() {
        let isValid = true;

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


    public ngOnInit() {
        this.model.initialize();

        //set default fields
        let defaultFields: any = {
            UserType: "RegularUser",
            status: "Active"
        }

        if(this.parent){
            defaultFields.user_name = this.parent.getField('email1');
            defaultFields.email1 = this.parent.getField('email1');
            defaultFields.first_name = this.parent.getField('first_name');
            defaultFields.last_name = this.parent.getField('last_name');
            defaultFields.salutation = this.parent.getField('salutation');
        }

        this.model.setFields(defaultFields)
        this.getFieldSets();
    }

    /**
     * returns if scope is internal or external
     */
    get scopeFilter(){
       return this.parent.module == 'Employees' ? 'i' : 'e';
    }

    public getStatus(tab){
        switch(tab){
            case 'user':
                return this.model.validate() ? 'complete' : 'error';
            case 'role':
                return this.userRoles.length > 0 ? 'complete' : 'error';
            default:
                return '';
        }
    }


    public getFieldSets() {
        let conf = this.metadata.getComponentConfig("UserCreateFromBeanModal", "Users");
        this.fieldset = conf.fieldset;
    }

    public cancel() {
        this.responseSubject.next(false);
        this.responseSubject.complete();
        this.self.destroy();
    }

    public next(){
        let currentStepIndex = this.steps.findIndex(s => s.value == this.step);
        if(this.steps.length >= currentStepIndex +1){
            this.step = this.steps[currentStepIndex + 1].value;
        }
    }

    /**
     * check that we can save
     */
    get canSave() {
        return this.model.validate() && this.userRoles.length > 0;
    }

    public save() {
        this.model.setFields({
            parent_type: this.parent.module,
            parent_id: this.parent.id,
            system_generated_password: this.externalAuthOnly ? false : this.systemGenerated,
            pwd_last_changed: new moment(),
            external_auth_only: this.externalAuthOnly
        });

        let userData  = {
            data: this.modelutilities.spiceModel2backend("Users", this.model.data),
            roles: this.userRoles,
            profiles: this.userProfiles,
            credentials: {
                newPassword: this.password,
                forceReset: this.forceReset,
                sendEmail: this.canSendByEmail ? this.sendByEmail : false
            }
        };

        this.backend.postRequest(`module/Users/${this.model.id}/create`, {}, userData).subscribe({
            next: (res) => {
                this.self.destroy();
            },
            error: (e) => {
                this.toast.sendToast('MSG_ERROR_CREATING_USER', 'error', e.error?.error?.message);
            }
        })
    }

    public saveUser() {

        let awaitModal = this.modal.await('LBL_SAVING_USER');
        this.model.setFields({
            system_generated_password: this.externalAuthOnly ? false : this.systemGenerated,
            pwd_last_changed: new moment(),
            external_auth_only: this.externalAuthOnly
        });
        let saveData = this.modelutilities.spiceModel2backend("Users", this.model.data);

        this.backend.postRequest("module/Users/" + this.model.id, {}, JSON.stringify(saveData))
            .subscribe({
                next: (response) => {
                    for (let fieldName in response) {
                        if (response.hasOwnProperty(fieldName)) {
                            response[fieldName] = this.modelutilities.backend2spice("Users", fieldName, response[fieldName]);
                        }
                    }
                    this.model.setData(response);
                    this.model.endEdit();

                    // in case of external auth close direct - otherwise save password
                    this.saveRoles()
                    awaitModal.emit(true);
                },
                error: (resErr) => {
                    /*
                    if (resErr.error.error.message) {
                        this.addcontainer.element.nativeElement.scrollTop = 0;
                        if (resErr.error.error.errorCode == 'duplicateUsername') {
                            this.model.setFieldMessage("error", resErr.error.error.message, "user_name", "validation");
                        }
                        if (resErr.error.error.errorCode == 'duplicateEmail1') {
                            this.model.setFieldMessage("error", resErr.error.error.message, "email1", "validation");
                        }
                    }
                    */
                    awaitModal.emit(true);
                }
            });
    }

    public saveRoles() {
        let awaitModal = this.modal.await('LBL_SAVING_ROLES');
        this.backend.postRequest(`module/Users/${this.model.id}/roles`, {}, this.userRoles).subscribe({
            next: () => {
                if(this.userProfiles.length > 0){
                    this.saveACLProfiles();
                } else {
                    if (!this.externalAuthOnly) {
                        this.savePassword();
                    } else {
                        this.self.destroy();
                    }
                }
                awaitModal.emit(true);
            },
            error: () => {
                awaitModal.emit(true);
            }
        })
    }

    public saveACLProfiles(){
        let awaitModal = this.modal.await('LBL_SAVING_PROFILES');
        this.backend.postRequest(`module/Users/${this.model.id}/related/spiceaclprofiles`, {}, this.userProfiles).subscribe({
            next: () => {
                if (!this.externalAuthOnly) {
                    this.savePassword();
                } else {
                    this.self.destroy();
                }
                awaitModal.emit(true);
            },
            error: () => {
                awaitModal.emit(true);
            }
        });
    }

    public savePassword() {
        let awaitModal = this.modal.await('LBL_SAVING_PASSWORD');
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
            awaitModal.emit(true);
                this.self.destroy();
        }, error => {
            this.sendByEmail = false;
            this.canSendByEmail = false;
            this.toast.sendToast(this.language.getLabel("MSG_PASSWORD_RESET_FAILED"), "error");
            awaitModal.emit(true);
        });
    }
}
