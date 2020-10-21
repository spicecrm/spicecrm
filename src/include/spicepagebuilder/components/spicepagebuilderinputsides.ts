/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {EditorAttributeI} from "../interfaces/spicepagebuilder.interfaces";

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

    constructor(private cdRef: ChangeDetectorRef, private spicePageBuilderService: SpicePageBuilderService) {
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
            top: parseFloat(splitValue[0]),
            right: parseFloat(splitValue.length == 1 ? value : splitValue[1]),
            bottom: parseFloat(splitValue.length == 1 ? value : splitValue[2]),
            left: parseFloat(splitValue.length == 1 ? value : splitValue[3])
        };
        this.cdRef.detectChanges();
    }

    /**
     * emit joined value
     */
    private emitJoinedValue() {
        const suffix = this.spicePageBuilderService.defaultSuffix;
        this.onChange(
            `${this.value.top + suffix} ${this.value.right + suffix} ${this.value.bottom + suffix} ${this.value.left + suffix}`
        );
    }
}
