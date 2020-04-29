/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";

/**
 * render four input fields to handle editing style attributes like margin or padding
 */
@Component({
    selector: 'spice-page-builder-input-text',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderinputtext.html',
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
    @Input() private label: string = '';
    /**
     * holds the sides value
     */
    private value: number = 0;

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
        this.value = parseFloat(value);
        this.cdRef.detectChanges();
    }

    /**
     * emit joined value
     */
    private emitJoinedValue() {
        this.onChange(
            this.value + this.spicePageBuilderService.defaultSuffix
        );
    }
}
