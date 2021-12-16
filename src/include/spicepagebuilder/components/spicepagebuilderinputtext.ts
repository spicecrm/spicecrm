/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * render four input fields to handle editing style attributes like margin or padding
 */
@Component({
    selector: 'spice-page-builder-input-text',
    templateUrl: '../templates/spicepagebuilderinputtext.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpicePageBuilderInputText)
        }
    ]
})
export class SpicePageBuilderInputText implements ControlValueAccessor {
    /**
     * name of the style attribute
     */
    @Input() public suffix: string;
    /**
     * name of the style attribute
     */
    @Input() public label: string = '';
    /**
     * holds the sides value
     */
    public value: number | string = '';

    /**
     * save on touched function for ControlValueAccessor
     */
    public onTouched: () => void;
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (modelValue: any) => void;

    constructor(public cdRef: ChangeDetectorRef) {
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
        this.value = !this.suffix ? value : parseFloat(value);
        this.cdRef.detectChanges();
    }

    /**
     * emit joined value
     */
    public emitJoinedValue() {
        this.onChange(
            !this.suffix ? this.value : this.value + this.suffix
        );
    }
}
