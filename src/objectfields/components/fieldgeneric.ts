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
    templateUrl: '../templates/fieldgeneric.html'
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
     * the fielddefs
     */
    public fielddefs: any = {};

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
    public _field_defs;

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
    public _css_classes: any[string] = [];

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
     * a setter that returns the value to the model and triggers the validation
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
        this.fielddefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (this.fielddefs && this.fielddefs.len) {
            this.fieldlength = this.fielddefs.len;
        }
        this.subscriptions.add(
            this.view.mode$.subscribe(mode => this.handleViewModeChange(mode))
        );
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
        if (stati.editable && (!this.view.isEditable || stati.readonly || this.fieldconfig.readonly)) {
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
            return this.view.displayLinks && this.fieldconfig.link && this.model.checkAccess('detail');
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
