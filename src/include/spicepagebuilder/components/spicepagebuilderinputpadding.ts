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
    selector: 'spice-page-builder-input-padding',
    templateUrl: '../templates/spicepagebuilderinputpadding.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpicePageBuilderInputPadding)
        }
    ]
})
export class SpicePageBuilderInputPadding implements ControlValueAccessor {
    /**
     * name of the style attribute
     */
    @Input() public label: string = '';

    /**
     * the number of padding values
     */
    public valueCount: string = '1';

    /**
     * holds the sides value
     */
    public value: { top, right, bottom, left } = {top: 0, right: 0, bottom: 0, left: 0};

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

    get valueCountNumber(){
        return parseInt(this.valueCount, 10);
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

        if (!value) {
            this.valueCount = '1';
            return;
        }
        const splitValue = value.split(' ');

        this.valueCount = splitValue.length.toString();

        switch(parseInt(this.valueCount, 10)){
            case 1:
                this.value = {
                    top: parseFloat(splitValue[0]),
                    right: parseFloat(splitValue[0]),
                    bottom: parseFloat(splitValue[0]),
                    left: parseFloat(splitValue[0])
                };
                break;
            case 2:
                this.value = {
                    top: parseFloat(splitValue[0]),
                    right: parseFloat(splitValue[1]),
                    bottom: parseFloat(splitValue[0]),
                    left: parseFloat(splitValue[1])
                };
                break;
            case 3:
                this.value = {
                    top: parseFloat(splitValue[0]),
                    right: parseFloat(splitValue[1]),
                    bottom: parseFloat(splitValue[2]),
                    left: parseFloat(splitValue[1])
                };
                break;
            case 4:
                this.value = {
                    top: parseFloat(splitValue[0]),
                    right: parseFloat(splitValue[1]),
                    bottom: parseFloat(splitValue[2]),
                    left: parseFloat(splitValue[3])
                };
                break;
        }
        this.cdRef.detectChanges();
    }

    /**
     * emit joined value
     */
    public emitJoinedValue() {
        const suffix = this.spicePageBuilderService.defaultSuffix;
        let paddingValue = '';
        switch (parseInt(this.valueCount, 10)){
            case 1:
                this.value.right = this.value.top;
                this.value.bottom = this.value.top;
                this.value.left = this.value.top;
                paddingValue = `${this.value.top + suffix}`;
                break;
            case 2:
                this.value.bottom = this.value.top;
                this.value.left = this.value.right;
                paddingValue = `${this.value.top + suffix} ${this.value.right + suffix}`;
                break;
            case 3:
                this.value.left = this.value.right;
                paddingValue = `${this.value.top + suffix} ${this.value.right + suffix} ${this.value.bottom + suffix}`;
                break;
            case 4:
                paddingValue = `${this.value.top + suffix} ${this.value.right + suffix} ${this.value.bottom + suffix} ${this.value.left + suffix}`;
                break;
        }

        this.onChange(
            paddingValue
        );
    }
}
