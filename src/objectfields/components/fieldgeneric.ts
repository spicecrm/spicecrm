/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectFields
 */
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";

@Component({
    selector: 'field-generic',
    templateUrl: './src/objectfields/templates/fieldgeneric.html'
})
export class fieldGeneric implements OnInit, AfterViewInit, OnDestroy {
    /**
     * identifies the focus element. If the field is set to edit mode a specific field can be set to be focused
     *
     * in case there are e.g. multiple inut elements define the most important one in the template
     */
    @ViewChild('focus', {read: ViewContainerRef, static: false}) public focuselement: ViewContainerRef;

    /**
     * the fielsname
     */
    @Input() public fieldname: string = '';

    /**
     * the fieldconfig .. typically passed in from the fieldset
     */
    @Input() public fieldconfig: any = {};

    /**
     * additonal classes top be added when the field is displayed
     */
    @Input() public fielddisplayclass: string = '';

    /**
     * a unique id that is issued in the constructor
     */
    public fieldid: string = '';

    /**
     * the max length of the field
     */
    public fieldlength: number = 999;

    /**
     * holds any subscription a field might have
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router
    ) {
        this.fieldid = this.model.generateGuid();

        this.subscriptions.add(
            this.view.mode$.subscribe(mode => this.handleViewModeChange(mode))
        );
    }

    /**
     * handle the view mode change
     * @param mode
     */
    public handleViewModeChange(mode) {
        if (mode == 'edit' && this.view.editfieldid && this.view.editfieldid == this.fieldid) {
            this.setFocus();
        }
    }

    /**
     * the field defs from teh metadata
     */
    private _field_defs;

    /**
     * gets the field defs from the metadata service
     */
    get field_defs() {
        if (!this._field_defs) {
            this._field_defs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        }
        return this._field_defs;
    }

    /**
     * additonal css classes uised internally for e.g. error handling
     */
    private _css_classes: any[string] = [];

    /**
     * a getter to return the additonal css classes
     */
    get css_classes() {
        if (this.getStati().invalid) {
            this.addCssClass('slds-has-error');
        } else {
            this.removeCssClass('slds-has-error');
        }

        return this._css_classes;
    }

    /**
     * get specific model options. here used to set update on blur
     */
    get modelOptions() {
        return {updateOn: 'blur'};
    }

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return this.model.getField(this.fieldname);
    }

    /**
     * a setter thjat returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val);
    }

    /**
     * a getter for any kind of errorsa the field might have
     */
    get errors() {
        return this.model.getFieldMessages(this.fieldname, 'error');
    }

    /**
     * a getter to check if the label shopudl be shown. That can be prohibited by the view or the fieldconfig
     */
    get displayLabel() {
        return this.view.displayLabels && this.fieldconfig.hidelabel !== true;
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (fieldDefs && fieldDefs.len) {
            this.fieldlength = fieldDefs.len;
        }
    }

    public ngAfterViewInit(): void {
        if (this.view.isEditMode() && this.view.editfieldname && this.view.editfieldname == this.fieldname) {
            this.setFocus();
        }
    }

    /**
     * a helper to set the focus
     *
     * an ugly workaround with the timeout but that is required to haneld change detection and the rendering process
     */
    public setFocus() {
        setTimeout(() => {
            if (this.focuselement) {
                if (!this.focuselement.element.nativeElement.tabIndex) this.focuselement.element.nativeElement.tabIndex = '-1';
                this.focuselement.element.nativeElement.focus();
            }
        });
    }

    /**
     * checks the satus for the field
     *
     * @param field optional the fieldname
     */
    public getStati(field: string = this.fieldname) {
        let stati = this.model.getFieldStati(field);
        if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
            stati.editable = false;
        }
        return stati;
    }

    /**
     * checks if the field is editbale
     *
     * @param field optional the fieldname
     */
    public isEditable(field: string = this.fieldname): boolean {
        return (this.model.checkAccess('edit') || this.model.checkAccess('create')) && this.getStati(field).editable && !this.getStati(field).readonly && !this.getStati(field).disabled && !this.getStati(field).hidden;
    }

    /**
     * a simple helper to check if we are in the edit mode or in display mode
     */
    public isEditMode() {
        return this.view.isEditMode() && this.isEditable();
    }

    /**
     * cheks if links shoudl be displayed. requires that the fieldconfig is set, the view does not prevent showing links and the user has details ACL rights
     */
    public displayLink() {
        try {
            return this.view.displayLinks && this.fieldconfig.link && this.model.data.acl.detail;
        } catch (e) {
            return false;
        }
    }

    /**
     * sets the edit mode on the view and the model into editmode itself
     */
    public setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    /**
     * returns the css classes
     */
    public getFieldClass() {
        return this.css_classes;
    }

    /**
     * returns a boolean if the field has errors
     *
     * @param field optional the fieldname
     */
    public fieldHasError(field?): boolean {
        return this.hasFieldErrors(field);
    }


    public hasFieldErrors(field: string = this.fieldname): boolean {
        return !!(this.getStati(field).invalid || this.errors);
    }

    /**
     * navigates to the record detail
     */
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

    /**
     * sets an error message on the field
     *
     * @param msg the message
     */
    public setFieldError(msg): boolean {
        return this.model.setFieldMessage('error', msg, this.fieldname, this.fieldid);
    }

    /**
     * clear the field error status
     */
    public clearFieldError(): boolean {
        return this.model.resetFieldMessages(this.fieldname, 'error', this.fieldid);
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
