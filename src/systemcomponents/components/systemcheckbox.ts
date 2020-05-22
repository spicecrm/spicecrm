/**
 * @module SystemComponents
 */
import {Component, EventEmitter, forwardRef, Input, Output, ChangeDetectorRef} from '@angular/core';
import {language} from "../../services/language.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var _;

/**
 * a standard checkbox component, compatible with ngModel!
 */
@Component({
    selector: 'system-checkbox',
    templateUrl: './src/systemcomponents/templates/systemcheckbox.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckbox),
            multi: true
        }
    ]
})
export class SystemCheckbox implements ControlValueAccessor {

    private id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...

    private _value: any = "1"; // the value used for the "value" attribute of the checkbox itself

    get value() {
        return this._value;
    }

    @Input()
    set value(val: any) {
        this._value = val;
    }

    private _model_value: any; // the value used for ngModel...
    get model_value() {
        return this._model_value;
    }

    set model_value(val) {
        if (val != this._model_value) {
            this.onChange(val);
        }

        this.writeValue(val);
    }

    private _checked = false;
    get checked(): boolean {
        return this._checked;
    }

    /**
     * set to true to render the checkbox without the NGContent. This is useful if you want to display the checkbox without any tzext and the adjacent elements are messing up the layout
     * ToDo: check if we can assess if ngcontent has been ppassed in ..
     */
    @Input() private hidelabel: boolean = false;

    @Input()
    set checked(val: boolean) {
        this._checked = val;
    }

    @Input() private disabled = false;
    @Input() private label: string;

    @Output('toggle')
    @Output('click')
    public click$ = new EventEmitter<boolean>();
    @Output('check') private check$ = new EventEmitter();
    @Output('uncheck') private uncheck$ = new EventEmitter();

    constructor(
        private language: language,
        private cdRef: ChangeDetectorRef
    ) {

    }

    private click() {
        if (this.disabled) return false;

        this.onTouched();

        this.checked = !this.checked;
        this.click$.emit(this.checked);
        if (this.checked) {
            this.check$.emit();
        } else {
            this.uncheck$.emit();
        }
    }

    // ControlValueAccessor implementation:
    private onChange(val: string){};// => void;
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    private onTouched(){};// => void;
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(obj: any): void {
        this._model_value = obj;
        // if checked state and model state are different, model state (model_value) overrules!
        if (this.model_value && !this.checked) {
            this.checked = true;
        } else if (!this.model_value && this.checked) {
            this.checked = false;
        }
        this.cdRef.detectChanges();
    }
}
