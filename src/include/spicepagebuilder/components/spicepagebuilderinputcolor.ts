/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * render four input fields to handle editing style attributes like margin or padding
 */
@Component({
    selector: 'spice-page-builder-input-color',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderinputcolor.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpicePageBuilderInputColor)
        }
    ]
})
export class SpicePageBuilderInputColor implements ControlValueAccessor {
    /**
     * name of the style attribute
     */
    @Input() private label: string = '';
    /**
     * holds the sides value
     */
    private value: string = '';

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
        this.value = value;
        this.cdRef.detectChanges();
    }

    /**
     * emit color value
     */
    private emitValue() {
        this.onChange(this.value);
    }
}
