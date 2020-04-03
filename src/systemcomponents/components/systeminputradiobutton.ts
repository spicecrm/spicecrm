/**
 * @module SystemComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {InputRadioOptionI} from "../interfaces/systemcomponents.interfaces";

declare var _;

/**
 * radio button group with the Lightning Design
 */
@Component({
    selector: 'system-input-radio-button',
    templateUrl: './src/systemcomponents/templates/systeminputradiobutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputRadioButton),
            multi: true
        }
    ]
})
export class SystemInputRadioButton implements ControlValueAccessor {

    /**
     * the value to be set
     */
    @Input() protected inputOption: InputRadioOptionI;
    /**
     * the value to be set
     */
    @Input() protected readonly disabled: boolean = false;
    /**
     * save on change function for ControlValueAccessor
     */
    private onChange: (value: string) => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    private onTouched: () => void;

    constructor(private cdRef: ChangeDetectorRef) {
    }

    /**
     * internal value checked
     */
    private _modelValue: string;

    /**
     * @return ng model value
     */
    get modelValue(): string {
        return this._modelValue;
    }

    /**
     * call ControlValueAccessor functions to update and emit changes
     * @param value
     */
    set modelValue(value: string) {
        this.onChange(value);
        this.writeValue(value);
    }

    /**
     * register on change ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any) {
        this.onChange = (val) => {
            fn(val);
        };
    }

    /**
     * register on touched function by ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * write value by ControlValueAccessor
     * @param value
     */
    public writeValue(value: string) {
        this._modelValue = value;
        this.cdRef.detectChanges();
    }
}
