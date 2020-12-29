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
    templateUrl: './src/workbench/templates/dictionarymanageritemstatus.html',
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
     * internal variable if checked
     */
    private status: any;

    /**
     * for the control accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;


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


    public writeValue(value: any): void {

    }

    toggleValue($e: MouseEvent) {
        $e.stopPropagation();
        this.status === 'a' ? this.status = 'd' : this.status = 'a';
        this.onChange(this.status);
    }
}
