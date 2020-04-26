/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * render four input fields to handle editing style attributes like margin or padding
 */
@Component({
    selector: 'spice-page-builder-input-sides',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderinputsides.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpicePageBuilderInputSides)
        }
    ]
})
export class SpicePageBuilderInputSides implements ControlValueAccessor {
    /**
     * name of the style attribute
     */
    @Input() private label: string = '';
    /**
     * name of the style attribute
     */
    @Input() private suffix: string = '';
    /**
     * holds the sides value
     */
    private value: { top, right, bottom, left } = {top: 0, right: 0, bottom: 0, left: 0};

    /**
     * save on touched function for ControlValueAccessor
     */
    private onTouched: () => void;
    /**
     * save on change function for ControlValueAccessor
     */
    private onChange: (modelValue: any) => void;

    constructor(private cdRef: ChangeDetectorRef) {
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
     * set the local value
     * @param value
     */
    public writeValue(value: any) {

        if (!value) return;
        const splitValue = value.split(' ');

        this.value = {
            top: splitValue[0] ? parseFloat(splitValue[0]) : 0,
            right: splitValue[1] ? parseFloat(splitValue[1]) : 0,
            bottom: splitValue[2] ? parseFloat(splitValue[2]) : 0,
            left: splitValue[3] ? parseFloat(splitValue[3]) : 0
        };
        this.cdRef.detectChanges();
    }

    /**
     * emit joined value
     */
    private emitJoinedValue() {
        this.onChange(
            `${this.value.top + this.suffix} ${this.value.right + this.suffix} ${this.value.bottom + this.suffix} ${this.value.left + this.suffix}`
        );
    }
}
