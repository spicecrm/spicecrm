/**
 * @module WorkbenchModule
 */
import {
    Component, forwardRef, Input, OnInit
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {EnumDisplayOptionArray, language} from "../../services/language.service";

@Component({
    selector: 'system-input-version',
    templateUrl: '../templates/systeminputversion.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputVersion),
            multi: true
        }
    ]
})
export class SystemInputVersion implements ControlValueAccessor, OnInit {

    /**
     * for the value accessor
     */
    public onChange: (value: string) => void;
    public onTouched: () => void;


    /**
     * holds currently selected package
     */
    @Input() _value: string = '';


    /**
     * holds all packages
     */
    public versions: EnumDisplayOptionArray = [];

    /**
     * to disable the checkbox
     */
    public _disabled = false;
    @Input('disabled') set disabled(value) {
        if (value === false) {
            this._disabled = false;
        } else {
            this._disabled = true;
        }
    }

    /**
     * the placeholder string
     * @private
     */
    @Input() public placeholder: string;

    /**
     * to disable autocomplete set value to off or set a specific value
     *
     * @private
     */
    @Input() public autocomplete: string = 'off';


    constructor( public modelutilities: modelutilities, public language: language ) { }

    get value() {
        return this._value;
    }

    set value(value:any) {
        this._value = value?.id;
        this.onChange(value?.id);
    }

    /**
     * generate an autocomplete breaker if th evalue shoudl be off
     */
    public ngOnInit() {
        this.versions = this.language.getDisplayOptions('spicecrmversion_dom', true);
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
