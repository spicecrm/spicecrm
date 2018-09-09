import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {language} from "../../services/language.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var _;

/**
 * a standard checkbox component, compatible with ngModel!
 * created by: sebastian franz at 2018-07-19
 */
@Component({
    selector: 'system-checkbox',
    templateUrl: './app/systemcomponents/templates/checkbox.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckbox),
            multi: true
        }
    ]
})
export class SystemCheckbox implements ControlValueAccessor
{
    id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...
    private _value:any = "1"; // the value used for the "value" attribute of the checkbox itself
    get value(){    return this._value; }
    @Input()
    set value(val:any)
    {
        this._value = val;
    }
    private _model_value:any; // the value used for ngModel...
    get model_value(){  return this._model_value;   }
    set model_value(val)
    {
        if(val != this._model_value)
            this.onChange(val);

        this.writeValue(val);
    }
    private _checked = false;
    get checked():boolean{  return this._checked;    }
    @Input()
    set checked(val:boolean)
    {
        //console.log('setting checked with', val);
        this._checked = val;
        /*
        if(val)
            this._model_value = this._value;
        else
            this._model_value = false;
        */
    }
    @Input() disabled = false;
    @Input() label:string;

    @Output('toggle')
    @Output('click')
    click$ = new EventEmitter<boolean>();
    @Output('check') check$ = new EventEmitter();
    @Output('uncheck') uncheck$ = new EventEmitter();

    constructor(
        private language: language
    ){

    }

    click()
    {
        if(this.disabled)
            return false;

        this.onTouched();

        this.checked = !this.checked;
        this.click$.emit(this.checked);
        if(this.checked) {
            //this.writeValue(this.value);
            this.check$.emit();
        }
        else
        {
            //this.writeValue(null);
            this.uncheck$.emit();
        }
    }

    //ControlValueAccessor implementation:
    private onChange = (val) => {};
    registerOnChange(fn: any): void {
        //this.onChange = fn;
        this.onChange = (val) => {
            //console.log('Propagating change', val);
            fn(val);
        }
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    private onTouched = () => {};

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void
    {
        //console.log('write value with:', obj);
        if(this.disabled)
            return;

        this._model_value = obj;
        // if checked state and model state are different, model state (model_value) overrules!
        if(this.model_value && !this.checked)
            this.checked = true;
        else if(!this.model_value && this.checked)
            this.checked = false;
    }

}