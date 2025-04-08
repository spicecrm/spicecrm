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
    selector: 'spice-page-builder-input-border',
    templateUrl: '../templates/spicepagebuilderinputborder.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpicePageBuilderInputBorder)
        }
    ]
})
export class SpicePageBuilderInputBorder implements ControlValueAccessor {
    /**
     * name of the style attribute
     */
    @Input() public label: string = '';

    public width: string;
    public style: string;
    public color: string;

    /**
     * save on touched function for ControlValueAccessor
     */
    public onTouched: () => void;
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (modelValue: any) => void;

    constructor(public cdRef: ChangeDetectorRef, public spicePageBuilderService: SpicePageBuilderService) {
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

        this.width = splitValue[0];
        this.style = splitValue[1];
        this.color = splitValue[2];

        this.cdRef.detectChanges();
    }

    /**
     * emit joined value
     */
    public emitJoinedValue() {
        const suffix = this.spicePageBuilderService.defaultSuffix;
        this.onChange(
            this.style ? `${this.width} ${this.style} ${this.color}` : undefined
        );
    }
}
