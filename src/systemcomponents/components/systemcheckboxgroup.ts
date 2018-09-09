import {Component, forwardRef, Host, Input, OnChanges} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var _;

/**
 * a checkbox group component, compatible with ngModel!
 * each system-checkbox-group-checkbox component clicked will add or reomove its value to the array.
 * created by: sebastian franz at 2018-08-17
 * inspired by: https://medium.com/@mihalcan/angular-multiple-check-boxes-45ad2119e115
 */
@Component({
    selector: 'system-checkbox-group',
    template: `<ng-content></ng-content>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckboxGroup),
            multi: true
        }
    ]
})
export class SystemCheckboxGroup implements ControlValueAccessor
{
    private _model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    get model() {
        return this._model;
    }
    set model(value: any) {
        this._model = value;
        this.onChange(this._model);
    }

    writeValue(value: any): void {
        this._model = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    toggleValue(value: any)
    {
        if (this.contains(value)) {
            this.remove(value);
        } else {
            this.add(value);
        }
    }

    contains(value: any): boolean {
        if (this._model instanceof Array) {
            return this._model.indexOf(value) > -1;
        } else if (!!this._model) {
            return this._model === value;
        }

        return false;
    }

    private add(value: any) {
        //console.log('add ', value);
        //if (!this.contains(value)) {
            if (this._model instanceof Array) {
                this._model.push(value);
            } else {
                this._model = [value];
            }
            this.onChange(this._model);
        //}
    }

    private remove(value: any) {
        //console.log('remove ', value);
        const index = this._model.indexOf(value);
        if (!this._model || index < 0) {
            return;
        }

        this._model.splice(index, 1);
        this.onChange(this._model);
    }
}

@Component({
    selector: 'system-checkbox-group-checkbox',
    template: `
        <span class="slds-checkbox">
            <input type="checkbox" id="checkbox-group-checkbox-{{id}}" [attr.aria-labelledby]="'checkbox-group-checkbox-button-label-'+id+' check-group-header'" [disabled]="disabled" [checked]="checked" (click)="toggle()" />
            <label class="slds-checkbox__label" for="checkbox-group-checkbox-{{id}}" id="checkbox-group-checkbox-button-label-{{id}}">
                <span class="slds-checkbox_faux"></span>
                <span class="slds-form-element__label"><ng-content></ng-content></span>
            </label>
        </span>`
})
export class SystemCheckboxGroupCheckbox implements OnChanges
{
    id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...
    @Input() value:any;
    @Input() disabled = false;
    private _checked = false;
    get checked():boolean{  return this._checked;    }
    @Input()
    set checked(val:boolean)
    {
        this._checked = val;
    }

    constructor(
        @Host() private grp: SystemCheckboxGroup
    ) {

    }

    toggle()
    {
        this.checked = !this.checked;
        this.grp.toggleValue(this.value);
        //console.log(this.checked, this.value);
    }

    ngOnChanges()
    {
        this._checked = this.grp.contains(this.value);
    }
}
