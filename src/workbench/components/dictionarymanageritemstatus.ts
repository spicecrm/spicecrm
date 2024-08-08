/**
 * @module Workbench
 */
import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * toggleable bulb icon
 */
@Component({
    selector: 'dictionary-manager-item-status',
    templateUrl: '../templates/dictionarymanageritemstatus.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DictionaryManagerItemStatus),
            multi: true
        }
    ]
})
export class DictionaryManagerItemStatus implements ControlValueAccessor {

    /**
     * allows this to be disabled
     * useful when the status shoudl be displayed but we do not want it ot be changeable since it is a referenced item
     *
     */
    public _disabled: boolean = false;
    @Input('disabled') set disabled(value) {
        if (value === false) {
            this._disabled = false;
        } else {
            this._disabled = true;
        }
    }

    /**
     * internal variable if checked
     */
    public status: 'i' | 'd' | 'a';

    /**
     * for the control accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;


    // ControlValueAccessor Interface: >>
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }


    /**
     * returns a status color
     *
     * @param status
     */
    public getStatusColor() {
        switch (this.status) {
            case 'a':
                return 'slds-icon-text-success';
            case 'i':
                return 'slds-icon-text-light';
            default:
                return 'slds-icon-text-warning';
        }
    }


    /**
     * write the initial value
     *
     * @param value
     */
    public writeValue(value: 'i' | 'd' | 'a'): void {
        this.status = value;
    }

    /**
     * toggle the value on click if the component is not disabled
     *
     * @param $e
     * @private
     */
    public toggleValue($e: MouseEvent) {
        if(!this._disabled) {
            $e.stopPropagation();
            this.status === 'a' ? this.status = 'i' : this.status = 'a';
            this.onChange(this.status);
        }
    }
}
