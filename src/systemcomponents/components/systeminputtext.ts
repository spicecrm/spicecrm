/**
 * @module WorkbenchModule
 */
import {
    Component, forwardRef, Input, OnInit, Output
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-text',
    templateUrl: './src/systemcomponents/templates/systeminputtext.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputText),
            multi: true
        }
    ]
})
export class SystemInputText implements ControlValueAccessor, OnInit {

    /**
     * for the value accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * the internal value
     * @private
     */
    private _value: string;

    /**
     * optionally set disabled
     * @private
     */
    @Input() private disabled: boolean = false;

    /**
     * the placeholder string
     * @private
     */
    @Input() private placeholder: string;

    /**
     * the max length attribute
     * @private
     */
    @Input() private maxlengt: number;

    /**
     * to disable autocomplete set value to off or set a specific value
     *
     * @private
     */
    @Input() private autocomplete: string;

    /**
     * a string to break the autocomplete
     *
     * @private
     */
    private autocompletebreaker: string = '';

    constructor(private modelutilities: modelutilities) {

    }

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
     * generate an autocomplete breaker if th evalue shoudl be off
     */
    public ngOnInit() {
        if(this.autocomplete) {
            this.autocompletebreaker = this.autocomplete == 'off' ? this.modelutilities.generateGuid() : this.autocomplete;
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

}
