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
export class fieldGeneric implements OnInit {
    @Input() public fieldname: string = '';
    @Input() public fieldconfig: any = {};
    public fieldid: string = '';
    public fieldlength: number = 999;
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

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (fieldDefs && fieldDefs.len) {
            this.fieldlength = fieldDefs.len;
        }
    }

    get modelOptions() {
        return {updateOn: 'blur'};
    }

    get value() {
        return this.model.getField(this.fieldname);
    }

    set value(val) {
        this.model.setField(this.fieldname, val);
    }

    get errors() {
        return this.model.getFieldMessages(this.fieldname, 'error');
    }

    get css_classes() {
        if (this.getStati().invalid) {
            this.addCssClass('slds-has-error');
        } else {
            this.removeCssClass('slds-has-error');
        }

        return this._css_classes;
    }

    get field_defs() {
        if (!this._field_defs) {
            this._field_defs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        }
        return this._field_defs;
    }

    public getStati(field: string = this.fieldname) {
        let stati = this.model.getFieldStati(field);
        if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
            stati.editable = false;
        }
        return stati;
    }

    public isEditable(field: string = this.fieldname): boolean {
        return this.getStati(field).editable && !this.getStati(field).readonly && !this.getStati(field).disabled && !this.getStati(field).hidden;
    }

    public isEditMode() {
        if (this.view.mode === 'edit' && this.isEditable()) {
            return true;
        } else {
            return false;
        }
    }

    public displayLink() {
        try {
            return this.view.displayLinks && this.fieldconfig.link && this.model.data.acl.detail;
        } catch (e) {
            return false;
        }
    }

    public setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    public getFieldClass() {
        return this.css_classes;
    }

    public fieldHasError(field?): boolean {
        return this.hasFieldErrors(field);
    }


    public hasFieldErrors(field: string = this.fieldname): boolean {
        if (this.getStati(field).invalid || this.errors) {
            return true;
        } else {
            return false;
        }
    }

    public goRecord() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

    public addCssClass(val: string): boolean {
        if (!this._css_classes.includes(val)) {
            this._css_classes.push(val);
        }
        return true;
    }

    public removeCssClass(val: string) {
        if (this._css_classes.includes(val)) {
            this._css_classes.splice(this._css_classes.indexOf(val), 1);
        }
        return true;
    }

    public toggleCssClass(val: string) {
        if (!this._css_classes.includes(val)) {
            this.addCssClass(val);
        } else {
            this.removeCssClass(val);
        }
        return true;
    }


    public setFieldError(msg): boolean {
        return this.model.setFieldMessage('error', msg, this.fieldname, this.fieldid);
    }

    public clearFieldError(): boolean {
        return this.model.resetFieldMessages(this.fieldname, 'error', this.fieldid);
    }
}