/**
 * @module WorkbenchModule
 */
import {
    Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnInit, Output
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import _ from "underscore";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'system-input-package',
    templateUrl: '../templates/systeminputpackage.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputPackage),
            multi: true
        }
    ]
})
export class SystemInputPackage implements ControlValueAccessor, OnInit {

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
     * holds all packages
     */
    public packages: any[] = [];

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


    constructor( public modelutilities: modelutilities, private elementRef: ElementRef, public configuration: configurationService ) { }

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
        this.packages = _.toArray(this.configuration.getData('domainvalidations')['spicecrmpackage_dom']?.validationvalues);
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
