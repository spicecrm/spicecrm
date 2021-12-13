/**
 * @module SystemComponents
 */
import {Component, forwardRef, Input} from '@angular/core';
import {userpreferences} from '../../services/userpreferences.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'system-input-number',
    templateUrl: '../templates/systeminputnumber.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputNumber),
            multi: true
        }
    ]
})
export class SystemInputNumber implements ControlValueAccessor {

    /**
     * the max this field is set to
     */
    @Input() public max: number;

    /**
     * the min value this field is set to
     *
     * @private
     */
    @Input() public min: number;
    @Input() public precision: number;
    @Input() public onlyField = false; // Display only the html input field, not the surrounding html
    @Input() public placeholder: string; // HTML attribute

    /**
     * to disable the field
     *
     * @private
     */
    @Input() public disabled = false; // HTML attribute

    @Input() public size: number; // HTML attribute

    /**
     * if set to true the valu eis emitted as number. Otherwise it is emitted as formatted string
     * @private
     */
    @Input() public asNumber: boolean = false; // HTML attribute

    /**
     * the internal held value as text as it is set and displayed in the field
     * @private
     */
    public textValue: string = '';

    /**
     * the last known text value needed for comparison
     *
     * @private
     */
    public lastTextValue: string = '';

    constructor(public userpreferences: userpreferences) {
    }

    // ControlValueAccessor Interface: >>

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this.textValue = value;
        // if (this.textValue) this.getValSanitized(this.textValue);
        this.lastTextValue = this.textValue;
    }

    public onChange(val: string|number): void {}

    public onTouched(): void {}

    // ControlValueAccessor Interface <<

    /**
     * Actions to do when the HTML input field changed.
     * @param event The DOM event
     */
    public fieldChanged(event) {
        this.textValue = typeof (this.textValue) != 'number' ? this.getValSanitized(this.textValue) : this.textValue;
        // Only submit the (new) value if the sanitized value has actually changed:
        if (this.textValue !== this.lastTextValue) {
            if (this.asNumber) {
                this.onChange(this.getNumberFromText(this.textValue));
            } else {
                this.onChange(this.textValue);
            }
            this.lastTextValue = this.textValue;
        } else event.stopPropagation(); // The value of the HTML input field changed, but the real value (sanitized) stayed the same. So no propagation of the change event.
    }

    /**
     * Takes a string that should be a number, removes group seperators, cuts to specific decimal places, limit it to min and max - and returns it as string (in case it is a valid number).
     * @param textValue The text value to sanitize.
     */
    public getValSanitized(textValue: string): string {
        let pref = this.userpreferences.toUse;
        let defSigDigits = this.precision === undefined ? pref.default_currency_significant_digits : this.precision;
        let numberValue: any = this.textValue.split(pref.num_grp_sep).join('');
        numberValue = numberValue.split(pref.dec_sep).join('.');
        numberValue = isNaN(parseFloat(numberValue)) ? undefined : (Math.floor(numberValue * Math.pow(10, defSigDigits)) / Math.pow(10, defSigDigits));
        numberValue = numberValue && numberValue > this.max ? this.max : numberValue;
        numberValue = numberValue && numberValue < this.min ? this.min : numberValue;
        return this.getValAsText(numberValue);
    }

    public getNumberFromText(textValue: string): number {
        let pref = this.userpreferences.toUse;
        let defSigDigits = this.precision === undefined ? pref.default_currency_significant_digits : this.precision;
        let numberValue: any = this.textValue.split(pref.num_grp_sep).join('');
        numberValue = numberValue.split(pref.dec_sep).join('.');
        numberValue = isNaN(parseFloat(numberValue)) ? undefined : (Math.floor(numberValue * Math.pow(10, defSigDigits)) / Math.pow(10, defSigDigits));
        return numberValue;
    }

    public getValAsText(numValue) {
        if (numValue === undefined) {
            return '';
        }
        let val = parseFloat(numValue);
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val, this.precision);
    }

}
