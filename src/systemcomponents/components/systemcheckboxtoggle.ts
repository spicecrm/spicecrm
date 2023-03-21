/**
 * @module SystemComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * renders a toggle checkbox as lightning design system style and handle the value with two way binding
 */
@Component({
    selector: 'system-checkbox-toggle',
    templateUrl: '../templates/systemcheckboxtoggle.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckboxToggle),
            multi: true
        }
    ]
})
export class SystemCheckboxToggle implements ControlValueAccessor {
    /**
     * holds the checkbox name
     */
    @Input() public name;
    /**
     * holds the checkbox label
     */
    @Input() public label = '';
    /**
     * holds the disabled boolean for the checkbox
     */
    @Input() public disabled = false;
    /**
     * holds the local value
     */
    public localValue: boolean;
    /**
     * holds the onChange function for NG_VALUE_ACCESSOR service
     * @private
     */
    public onChange: (val: string) => void;
    /**
     * holds the onTouched function for NG_VALUE_ACCESSOR service
     * @private
     */
    public onTouched: (val: string) => void;

    constructor(
        public cdRef: ChangeDetectorRef) {
    }

    /**
     * register the onChange function for NG_VALUE_ACCESSOR service
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * set the local value by NG_VALUE_ACCESSOR service
     * @param value
     */
    public writeValue(value: boolean): void {
        this.localValue = value;
        this.cdRef.detectChanges();
    }
}
