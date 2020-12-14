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

    /**
     * set to true to render the checkbox without the NGContent. This is useful if you want to display the checkbox without any text and the adjacent elements are messing up the layout
     * ToDo: check if we can assess if ngcontent has been ppassed in ..
     */
    @Input() private hidelabel: boolean = false;

    /**
     * set to true if the model value should be returned as integer
     */
    @Input() private asinteger: boolean = false;


    /**
     * to disable the checkbox
     */
    @Input() private disabled = false;

    /**
     * an event emitter for the click
     */
    @Output('click') public click$ = new EventEmitter<boolean>();

    /**
     * an event emitter for the click
     */
    @Output('change') public change$ = new EventEmitter<MouseEvent>();

    /**
     * the internal uinique id for the element
     */
    private id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...

    /**
     * the internal held value for the model
     */
    private _model_value: any;

    /**
     * the value to set for the checkbox
     */
    private _value: any = "1"; // the value used for the "value" attribute of the checkbox itself

    get value() {
        return this._value;
    }

    @Input()
    set value(val: any) {
        this._value = val;
    }


    get model_value() {
        return this.asinteger ? this._model_value == 1 ? true: false : this._model_value;
    }

    set model_value(val) {
        let mval = this.asinteger ? val ? 1 : 0 : val
        if (mval != this._model_value) {
            this.onChange(mval);
        }

        this.writeValue(mval);
    }


    constructor(
        private language: language,
        private cdRef: ChangeDetectorRef
    ) {

    }

    private click(e: MouseEvent) {
        e.stopPropagation();

        if (this.disabled) return false;

        this.onTouched();

        this.click$.emit(this.value);
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

        this.cdRef.detectChanges();
    }
}
