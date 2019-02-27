import {Component, forwardRef, Input} from '@angular/core';
import {userpreferences} from '../../services/userpreferences.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-number',
    templateUrl: './src/systemcomponents/templates/systeminputnumber.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputNumber),
            multi: true
        }
    ]
})
export class SystemInputNumber implements ControlValueAccessor {

    @Input() private max: number;
    @Input() private min: number;
    @Input() private precision: number;
    private textValue: string = '';

    constructor(public userpreferences: userpreferences) {
    }

    // ControlValueAccessor Interface: >>

    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this.textValue = value;
    }

    private onChange(val: string): void {
    };

    private onTouched(): void {
    };

    // ControlValueAccessor Interface <<

    private onBlur() {
        let pref = this.userpreferences.toUse;
        let defSigDigits = this.precision || pref.default_currency_significant_digits;
        let numberValue: any = this.textValue.split(pref.num_grp_sep).join('');
        numberValue = numberValue.split(pref.dec_sep).join('.');
        numberValue = isNaN(parseFloat(numberValue)) ? undefined : (Math.floor(numberValue * Math.pow(10, defSigDigits)) / Math.pow(10, defSigDigits));
        numberValue = numberValue && numberValue > this.max ? this.max : numberValue;
        numberValue = numberValue && numberValue < this.min ? this.min : numberValue;
        this.textValue = this.getValAsText(numberValue);
        this.onChange(this.textValue);
    }

    private getValAsText(numValue) {
        if (numValue === undefined) {
            return '';
        }
        let val = parseFloat(numValue);
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val);
    }
}