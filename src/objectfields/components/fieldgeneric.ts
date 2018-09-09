import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';

@Component({
    selector: 'field-generic',
    templateUrl: './src/objectfields/templates/fieldgeneric.html'
})
export class fieldGeneric implements OnInit
{
    @Input() fieldname: string = '';
    @Input() fieldconfig: any = {};
    fieldid: string = '';
    fieldlength: number = 999;
    private _field_defs;
    private _css_classes: any[string] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        this.fieldid = this.model.generateGuid();
    }

    ngOnInit(){
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if(fieldDefs && fieldDefs.len)
            this.fieldlength = fieldDefs.len;
    }

    get modelOptions(){
        return { updateOn: 'blur' }
    }

    get value() {
        return this.model.getField(this.fieldname);
    }

    set value(val) {
        this.model.setField(this.fieldname, val);
    }

    get errors()
    {
        return this.model.getFieldMessages(this.fieldname, 'error');
    }

    /*
        get stati() {
            let stati = this.model.getFieldStati(this.fieldname);
            if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
                stati.editable = false;
                //console.log('setting '+this.fieldname+' uneditable!');
            }
            //console.log(this.fieldname+' editable:'+stati.editable);

            return stati;
        }
    */
    get css_classes() {
        if (this.getStati().invalid) this.addCssClass('slds-has-error');
        //else if (this.getStati().incomplete) this.addCssClass('slds-has-error');
        else this.removeCssClass('slds-has-error');

        return this._css_classes;
    }

    get field_defs()
    {
        if(!this._field_defs)
            this._field_defs = this.metadata.getFieldDefs(this.model.module, this.fieldname);

        return this._field_defs;
    }

    getStati(field:string = this.fieldname)
    {

        let stati = this.model.getFieldStati(field);

        // if(this.model.data && this.model.data.acl &&!this.model.checkAccess('edit')) stati.editable = false;

        if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
            stati.editable = false;

        }

        return stati;
    }

    isEditable(field:string = this.fieldname):boolean
    {
        /*
        if(
            !this.view.isEditable ||
            this.fieldconfig.readonly ||
            (this.model.data && this.model.data.acl_fieldcontrol && this.model.data.acl_fieldcontrol[this.fieldname] && parseInt(this.model.data.acl_fieldcontrol[this.fieldname]) < 3) )
            return false;
        else
            return true;
        */

        return this.getStati(field).editable && !this.getStati(field).readonly && !this.getStati(field).disabled && !this.getStati(field).hidden;
    }

    isEditMode() {
        if (this.view.mode === 'edit' && this.isEditable())
            return true;
        else
            return false;
    }

    displayLink() {
        try {
            return this.view.displayLinks && this.fieldconfig.link && this.model.data.acl.detail;
        } catch (e) {
            return false;
        }
    }

    setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    getFieldClass() {
        return this.css_classes;
    }

    fieldHasError(field?):boolean {
        return this.hasFieldErrors(field);
    }



    hasFieldErrors(field:string = this.fieldname):boolean
    {
        if (this.getStati(field).invalid || this.errors)
            return true;
        else
            return false
    }

    goRecord() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    addCssClass(val: string): boolean {
        if (!this._css_classes.includes(val)) {
            this._css_classes.push(val);
        }
        //console.log(val, this.field_css_classes);
        return true;
    }

    removeCssClass(val: string) {
        if (this._css_classes.includes(val)) {
            this._css_classes.splice(this._css_classes.indexOf(val), 1);
        }
        return true;
    }

    toggleCssClass(val: string) {
        if (!this._css_classes.includes(val)) {
            this.addCssClass(val);
        }
        else {
            this.removeCssClass(val);
        }
        return true;
    }




    setFieldError(msg):boolean
    {
        return this.model.setFieldMessage('error', msg, this.fieldname, this.fieldid);
    }

    clearFieldError():boolean
    {
        return this.model.resetFieldMessages(this.fieldname, 'error', this.fieldid);
    }

}



/*

import { Validator, AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import { Directive, forwardRef } from '@angular/core';



export function validateModelValidationRules(fieldname:string, model:model): ValidatorFn
{
    return (control: AbstractControl): {[key: string]: any} =>
    {
        model.evaluateValidationRules(fieldname, 'change');
        return null;
    };
}



@Directive({
    selector: '[validateModelField][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => ModelValidationDirective), multi: true}]
})
export class ModelValidationDirective implements Validator
{
    @Input() validateModelField;

    constructor(private model:model) {

    }

    validate(control:AbstractControl): {[key: string]: any} {
        return validateModelValidationRules(this.validateModelField, this.model)(control);
    }
}

*/