/**
 * @module WorkbenchModule
 */
import {
    Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-integer',
    templateUrl: '../templates/systeminputinteger.html',
    providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemInputInteger),
        multi: true
    }
]
})
export class SystemInputInteger implements ControlValueAccessor {

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;

    public _value: string;

    /**
     * optionally set disabled
     * @private
     */
    @Input() public disabled: boolean = false;

    constructor( private elementRef: ElementRef ) { }

    get value() {
        return this._value;
    }

    set value(value) {
        if (value != this._value) {
            this._value = value;
            this.onChange(value);
        }
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

    public emitBlur() {
        this.elementRef.nativeElement.dispatchEvent(new Event('blur',{bubbles: true}));
    }

}
