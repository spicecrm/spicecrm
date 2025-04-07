/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * render four input fields to handle editing style attributes like margin or padding
 */
@Component({
    selector: 'spice-page-builder-input-width',
    templateUrl: '../templates/spicepagebuilderinputwidth.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpicePageBuilderInputWidth)
        }
    ]
})
export class SpicePageBuilderInputWidth implements ControlValueAccessor {
    /**
     * the dimension
     */
    public unit: 'px'|'%' = 'px'
    /**
     * name of the style attribute
     */
    @Input() public label: string = '';
    /**
     * name of the style attribute
     */
    @Input() public disabled: boolean = false;
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
        let unitpos = value.search('px') >= 0 ? value.search('px') : value.search('%');
        this.value = parseFloat(value.substring(0, unitpos));
        this.unit = value.substring(unitpos);
        // this.cdRef.detectChanges();
    }

    /**
     * emit joined value
     */
    public emitJoinedValue() {
        this.onChange(
            this.value + this.unit
        );
    }
}
