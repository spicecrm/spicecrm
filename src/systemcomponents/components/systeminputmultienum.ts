/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-multienum',
    templateUrl: '../templates/systeminputmultienum.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputMultiEnum),
            multi: true
        }
    ]
})
export class SystemInputMultiEnum implements OnInit, ControlValueAccessor {

    /**
     * the module so the enum can be determined
     */
    @Input() public module: string;

    /**
     * the field so the enum and the values can be determined
     */
    @Input() public field: string;

    /**
     * the field so the enum and the values can be determined
     */
    @Input() public sortdirection: string;

    /**
     * the options from the enum
     */
    public options: any[] = [];

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * the value
     */
    public _value: string;


    constructor(public metadata: metadata, public language: language) {
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.onChange(value);
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        this._value = value;
    }

    public ngOnInit(): void {
        this.getOptions();
    }

    public getOptions() {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.module, this.field);
        for (let optionVal in options) {
            if (optionVal && options[optionVal]) {
                retArray.push({
                    value: optionVal,
                    display: options[optionVal]
                });
            }
        }
        this.options = retArray;
        if (this.sortdirection) {
            switch (this.sortdirection.toLowerCase()) {
                case 'desc':
                    this.options.sort((a, b) => a.display.toLowerCase() < b.display.toLowerCase() ? 1 : -1);
                    break;
                case 'asc':
                    this.options.sort((a, b) => a.display.toLowerCase() > b.display.toLowerCase() ? 1 : -1);
            }
        }
    }

}
