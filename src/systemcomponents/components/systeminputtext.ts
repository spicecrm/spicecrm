/**
 * @module WorkbenchModule
 */
import {
    Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnInit, Output
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-text',
    templateUrl: '../templates/systeminputtext.html',
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
    public onChange: (value: string) => void;
    public onTouched: () => void;

    // @Output() public blur = new EventEmitter();

    /**
     * the internal value
     * @private
     */
    public _value: string;

    /**
     * optionally set disabled
     * @private
     */
    @Input() public disabled: boolean = false;

    /**
     * the placeholder string
     * @private
     */
    @Input() public placeholder: string;

    /**
     * the max length attribute
     * @private
     */
    @Input() public maxlength: number;

    /**
     * to disable autocomplete set value to off or set a specific value
     *
     * @private
     */
    @Input() public autocomplete: string = 'off';

    /**
     * Enable the clear button.
     */
    @Input() public showClear = false;

    @Input('trim') public set _trimInput( flag: boolean ) {
        this.trimInput = flag ? 'blur' : false;
    }
    public trimInput: 'blur'|boolean = false;


    /**
     * set to true to display the input with an error class
     */
    @Input() public haserror: boolean = false;

    /**
     * a string to break the autocomplete
     *
     * @private
     */
    public autocompletebreaker: string = '';

    constructor( public modelutilities: modelutilities, private elementRef: ElementRef ) { }

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

    public emitBlur() {
        this.elementRef.nativeElement.dispatchEvent(new Event('blur',{bubbles: true}));
    }

    /**
     * Show the clear button or not.
     */
    public showClearButton() {
        return !this.disabled && this.showClear && this.value;
    }

}
