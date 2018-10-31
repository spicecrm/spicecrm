import {Component, EventEmitter, forwardRef, Host, Input, OnChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;
    public model$ = new EventEmitter();
    private _model: any;
    get model() {
        return this._model;
    }
    set model(value: any) {
        this._model = value;
        this.onChange(this._model);
        this.model$.emit(this._model);
    }

    public writeValue(value: any): void {
        this._model = value;
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public toggleValue(value: any)
    {
        if (this.contains(value)) {
            this.remove(value);
        } else {
            this.add(value);
        }
    }

    /**
     *
     * @param value any if value is an array, each element inside has to be set to be true
     * @returns {boolean}
     */
    public contains(value: any): boolean
    {
        if (this._model instanceof Array) {
            // if value is an array, check if each member is represented
            if(value instanceof Array)
            {
                for(let subvalue of value)
                {
                    if(this._model.indexOf(subvalue) == -1){
                        return false;
                    }
                }
                return true;
            } else {
                return this._model.indexOf(value) > -1;
            }
        } else if (!!this._model) {
            return this._model === value;
        }

        return false;
    }

    /**
     *
     * @param value any if it is an array, each element inside will be added
     */
    public add(value: any)
    {
        if (!(this._model instanceof Array)) {
            this._model = [];
        }

        if(value instanceof Array)
        {
            for(let subvalue of value)
            {
                if(!this.contains(subvalue))
                {
                    this._model.push(subvalue);
                }
            }
        } else {
            if(!this.contains(value)) {
                this._model.push(value);
            }
        }
/*
        if (this._model instanceof Array) {
            this._model.push(value);
        } else {
            this._model = [value];
        }
*/
        this.model$.emit(this._model);
        this.onChange(this._model);
    }

    /**
     *
     * @param value any if it is an array, each element inside will be removed
     */
    public remove(value: any)
    {
        if(value instanceof Array) {
            for(let subvalue of value)
            {
                let idx = this._model.indexOf(subvalue);
                if(idx >= 0)
                {
                    this._model.splice(idx, 1);
                }
            }
        } else {
            let idx = this._model.indexOf(value);
            if (idx >= 0) {
                this._model.splice(idx, 1);
            }
        }

        this.model$.emit(this._model);
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
    public id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...
    @Input() public value: any;
    @Input() public disabled = false;
    private _checked = false;
    get checked(): boolean{  return this._checked;    }
    @Input()
    set checked(val: boolean)
    {
        this._checked = val;
    }

    constructor(
        @Host() private grp: SystemCheckboxGroup
    ) {
        this.grp.model$.subscribe(
            next => {
                this.ngOnChanges();
            }
        );
    }

    private toggle()
    {
        this.checked = !this.checked;
        if(this.checked){
            this.grp.add(this.value);
        } else {
            this.grp.remove(this.value);
        }
        //this.grp.toggleValue(this.value);
        //console.log(this.checked, this.value);
    }

    public ngOnChanges()
    {
        this._checked = this.grp.contains(this.value);
    }
}
