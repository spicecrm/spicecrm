/**
 * @module ModuleUsers
 */
import {
    ChangeDetectorRef,
    Component, EventEmitter,
    forwardRef,
    OnInit,
    Output,
    SkipSelf,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
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
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "user-create-password",
    templateUrl: "../templates/usercreatepassword.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UserCreatePassword),
            multi: true
        }
    ]
})
export class UserCreatePassword implements OnInit, ControlValueAccessor{

    public _password: string;
    public repeatPassword: string;
    public pwdCheck: RegExp = new RegExp("//");
    public userNameCheck: RegExp = new RegExp("^(?![_.])(?!.*[_.]{2})[@a-zA-Z0-9._-]{1,60}$");
    public pwdGuideline: string;
    public autogenerate: boolean = false;
    public sendByEmail: boolean = false;
    public forceReset: boolean = true;
    public externalauthonly: boolean = false;
    public showPassword: boolean = false;
    public saveTriggered: boolean = false;
    public canSendByEmail: boolean = true;

    @Output() sendbyemail: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() forcereset: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() extauthonly: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() systemgenerated: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * for the control accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

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


    }

    public ngOnInit() {
        this.getPassInfo();
    }


    // ControlValueAccessor Interface: >>
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        if ( value === undefined ) return;
        this._password = value;
    }

    /**
     * emit all changes
     */
    public emitChanges(){
        this.sendbyemail.emit(this.sendByEmail);
        this.extauthonly.emit(this.externalAuthOnly);
        this.forcereset.emit(this.forceReset);
        this.systemgenerated.emit(this.autogenerate);
    }

    get password(){
        return this._password
    }

    set password(value){
        this._password = value;
        this.onChange(value);
    }

    get modelOptions() {
        return {updateOn: 'blur'};
    }


    get PwdFieldType() {
        return this.showPassword ? 'text' : 'password';
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
        return (!this.externalAuthOnly && (this.pwdFieldEmpty || this.pwdNotMatchGuide)) ? 'slds-has-error' : '';
    }

    get rePwdFieldStyle() {
        return (!this.externalAuthOnly && (this.rePwdFieldEmpty || this.rePwdNotSame)) ? 'slds-has-error' : '';
    }

    get hasError() {
        let isValid = true;
        if (!this.externalAuthOnly && !this.autoGenerate && this.pwdGuideline && this.pwdNotMatchGuide) {
            isValid = false;
        }
        if (!this.externalAuthOnly && !this.autoGenerate && (!this.password || this.rePwdNotSame)) {
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

    /**
     * getter for external auth only
     */
    get externalAuthOnly(){
        return this.externalauthonly
    }

    /**
     * setter for extenral auth only
     * resets other flags and password
     *
     * @param value
     */
    set externalAuthOnly(value){
        this.externalauthonly = value;
        if(value){
            this.autogenerate = false;
            this.sendByEmail = false;
            this.forceReset = false;
            this.password = '';
            this.showPassword = false;
            this.repeatPassword = '';
        }
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
        navigator.clipboard.writeText(this.password);
        this.toast.sendToast(this.language.getLabel("MSG_PASSWORD_COPIED"), "success");
    }
}
