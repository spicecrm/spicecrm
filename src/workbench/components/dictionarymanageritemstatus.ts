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
     * allows this to be disabled
     * useful when the status shoudl be displayed but we do not want it ot be changeable since it is a referenced item
     *
     * @private
     */
    @Input() private disabled: boolean = false;

    /**
     * internal variable if checked
     */
    private status: 'i' | 'd' | 'a';

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
    private toggleValue($e: MouseEvent) {
        if(!this.disabled) {
            $e.stopPropagation();
            this.status === 'a' ? this.status = 'i' : this.status = 'a';
            this.onChange(this.status);
        }
    }
}
