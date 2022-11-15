/**
 * @module SystemComponents
 */
import {Component, ElementRef, forwardRef, Input, Renderer2, ViewChild} from '@angular/core';
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
     * The input field element
     * used to re-position cursor after the field content changed
     */
    @ViewChild('numberinput', {static: false}) public numberinput: ElementRef

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

    /**
     * The number of digits after decimal separator
     * @param precision
     */
    @Input('precision') set onPrecisionChange(precision: number){
        this.precision = precision;
        this.textValue = typeof (this.textValue) != 'number' ? this.getValSanitized(this.textValue) : this.textValue;
    }
    public precision: number;

    /**
     * Display only the html input field, not the surrounding html
     */
    @Input() public onlyField = false;

    /**
     * HTML attribute placeholder
     */
    @Input() public placeholder: string;

    /**
     * to disable the field
     * HTML attribute
     */
    @Input() public disabled = false;

    /**
     * to set the size of the field
     * HTML attribute
     */
    @Input() public size: number;

    /**
     * if set to true the value is emitted as number. Otherwise it is emitted as formatted string
     * HTML attribute
     */
    @Input() public asNumber: boolean = false;

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


    /**
     * a list of allowed Keys that the user might hit on the keyboard while typing
     * and shall impact the content of the field
     */
    public allowedKeys: any[] = ['ArrowRight', 'ArrowLeft', 'Backspace', 'Delete', 'Control'];

    /**
     * to store when the decimal separator key was stroke
     */
    public decimalKeyStroke: string = '';

    /**
     * to store the position of the decimal separator
     */
    public curposStartDecimalKeyStroke: number = 0;

    /**
     * to store the latest key hit by the user
     */
    public latestKeyStroke: string = '';

    /**
     * the number of keys stroke after decimal separator was entered
     */
    public counterAfterdecimalKeyStroke: number = 0;


    constructor(public userpreferences: userpreferences, public renderer: Renderer2) {
    }

    // ControlValueAccessor Interface: >>

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public writeValue(value: any): void {
        this.textValue = typeof (value) != 'number' ? this.getValSanitized(value) : this.getValAsText(value);
        this.lastTextValue = this.textValue;
    }

    // tslint:disable-next-line:no-empty
    public onChange(val: string|number): void {}

    // tslint:disable-next-line:no-empty
    public onTouched(): void {}

    // ControlValueAccessor Interface <<

    /**
     * Actions to do when the HTML input field changed.
     * @param event The DOM event
     */
    public fieldChanged(event) {
        let curpos = this.numberinput.nativeElement.selectionEnd;
        let curposStart = this.numberinput.nativeElement.selectionStart;
        let curposStartDecimalKeyStroke = this.textValue.indexOf(this.userpreferences.toUse.dec_sep);
        let originalTextValueLength = this.textValue.length;

        this.textValue = typeof (this.textValue) != 'number' ? this.getValSanitized(this.textValue) : this.textValue;


        // Only submit the (new) value if the sanitized value has actually changed:
        if (this.textValue !== this.lastTextValue) {
            if (this.asNumber) {
                this.onChange(this.getNumberFromText(this.textValue));
            } else {
                this.onChange(this.textValue);
            }
            this.lastTextValue = this.textValue;

            // re-position cursor
            this.setCursorPosition(curpos, curposStart, curposStartDecimalKeyStroke, originalTextValueLength);

        } else event.stopPropagation(); // The value of the HTML input field changed, but the real value (sanitized) stayed the same. So no propagation of the change event.
    }

    /**
     * Takes a string that should be a number, removes group seperators, cuts to specific decimal places, limit it to min and max - and returns it as string (in case it is a valid number).
     * @param textValue The text value to sanitize.
     */
    public getValSanitized(textValue: string): string {
        let pref = this.userpreferences.toUse;
        let defSigDigits = (this.precision === undefined) ? pref.default_currency_significant_digits : this.precision;
        let numberValue: any = this.textValue.split(pref.num_grp_sep).join('');
        if(!this.isInteger()){
            numberValue = numberValue.split(pref.dec_sep).join('.');
        }

        if(isNaN(numberValue = parseFloat(numberValue))){
            numberValue = undefined;
            this.decimalKeyStroke = '';
            this.counterAfterdecimalKeyStroke = 0;
        } else {
            numberValue = (Math.floor(numberValue * Math.pow(10, defSigDigits)) / Math.pow(10, defSigDigits));
        }

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

    /**
     * convert the text value into a number value
     * @param numValue
     */
    public getValAsText(numValue) {
        if (numValue === undefined) {
            return '';
        }
        let val;
        if(!this.isInteger()){
            val = parseFloat(numValue);
        } else{
            val = parseInt(numValue, 10);
        }
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val, this.precision);
    }

    /**
     * catch the input on keydown and handle content
     * @param e
     */
    public checkInput(e) {
        // Check on allowed chars: digits and separators
        let regex = new RegExp(this.defineInputPattern(),"g");

        // store key
        this.latestKeyStroke = e.key;

        // increment counter
        if(this.decimalKeyStroke == this.userpreferences.toUse.dec_sep){
            this.counterAfterdecimalKeyStroke++;
            if(this.counterAfterdecimalKeyStroke > this.userpreferences.toUse.default_currency_significant_digits){
                this.counterAfterdecimalKeyStroke = 1;
            }
        }

        // initialize counter
        if(e.key == this.userpreferences.toUse.dec_sep){
            this.decimalKeyStroke = e.key;
            this.counterAfterdecimalKeyStroke = 0;
        }

        if (!regex.test(e.key) && this.allowedKeys.indexOf(e.key) < 0) {
            // leave the field on Tab (therefore do not preventDefault when it is Tab
            if(e.key != 'Tab'){
                // e.preventDefault();
            } else{
                // reset
                this.decimalKeyStroke = '';
                this.counterAfterdecimalKeyStroke = 0;
            }
        }
    }

    /**
     * handle value on keyup
     * format value
     * position cursor
     */
    public changed() {
        let curpos = this.numberinput.nativeElement.selectionEnd;
        let curposStart = this.numberinput.nativeElement.selectionStart;
        let curposStartDecimalKeyStroke = this.textValue.indexOf(this.userpreferences.toUse.dec_sep);
        let setCursorPosition = false;
        let textValueLength = this.textValue.length;

        let val: any = this.textValue;
        this.textValue = this.getValSanitized(val);
        let textValueLengthNew = this.textValue.length;
        let curposEndDecimalKeyStroke = this.textValue.indexOf(this.userpreferences.toUse.dec_sep);

        // recalculate cursor position:
        // we position after latest entered digit
        // we reposition only when user is not moving cursor using arrows
        // console.log(curposStart, curposStartDecimalKeyStroke, this.decimalKeyStroke, curposEndDecimalKeyStroke);
        if(this.allowedKeys.indexOf(this.latestKeyStroke) < 0){
            if(curposEndDecimalKeyStroke > 0){
                curpos = curposEndDecimalKeyStroke;
            } else{
                curpos = curposStart;
                setCursorPosition = true;
            }

            if (this.decimalKeyStroke == this.userpreferences.toUse.dec_sep) {
                // first input
                curpos = curpos + 1 + this.counterAfterdecimalKeyStroke;
                setCursorPosition = true;
            } else if (this.decimalKeyStroke == '' && curposEndDecimalKeyStroke > 0) {
                // editing existing value
                curpos = curposStart;
                if (curposStartDecimalKeyStroke > 0) {
                    curpos = curpos + (curposEndDecimalKeyStroke - curposStartDecimalKeyStroke);
                }
                setCursorPosition = true;
            }

        } else{
            if(this.latestKeyStroke == 'Backspace' || this.latestKeyStroke == 'Delete'){
                // reset
                this.decimalKeyStroke = '';
                this.counterAfterdecimalKeyStroke = 0;
                // calculate position
                curpos = curposStart;
                if(curposStart - curposEndDecimalKeyStroke == 1){
                    curpos = curpos-1;
                }
                setCursorPosition = true;
            }
        }

        // set a brieftimeout and set the current pos back to the field tricking the Change Detection
        if(setCursorPosition){
            setTimeout(() => {
                this.renderer.setProperty(this.numberinput.nativeElement, 'selectionEnd', curpos);
            });
        }
    }

    /**
     * recalculate cursor position:
     * we position after latest entered digit
     * we reposition only when user is not moving cursor using arrows
     * we consider the position of the decimal separator when there is one
     */
    public setCursorPosition(curpos, curposStart, curposStartDecimalKeyStroke, originalTextValueLength){
        let curposEndDecimalKeyStroke = this.textValue.indexOf(this.userpreferences.toUse.dec_sep);
        let setCursorPosition = false;

        if(this.allowedKeys.indexOf(this.latestKeyStroke) < 0){
            if(!this.isInteger()) {
                curpos = curposEndDecimalKeyStroke;

                if (this.decimalKeyStroke == this.userpreferences.toUse.dec_sep) {
                    // first input
                    curpos = curpos + 1 + this.counterAfterdecimalKeyStroke;
                    setCursorPosition = true;
                } else if (this.decimalKeyStroke == '' && curposEndDecimalKeyStroke > 0) {
                    // editing existing value
                    curpos = curposStart;
                    if (curposStartDecimalKeyStroke > 0) {
                        curpos = curpos + (curposEndDecimalKeyStroke - curposStartDecimalKeyStroke);
                    }
                    setCursorPosition = true;
                }
            } else{
                curpos = curposStart + (this.textValue.length - originalTextValueLength);
                setCursorPosition = true;
            }

        } else{
            if(this.latestKeyStroke == 'Backspace' || this.latestKeyStroke == 'Delete'){
                // reset
                this.decimalKeyStroke = '';
                this.counterAfterdecimalKeyStroke = 0;
                // calculate position
                if(!this.isInteger()) {
                    curpos = curposStart;
                    if (curposStart - curposEndDecimalKeyStroke == 1) {
                        curpos = curpos - 1;
                    }
                } else {
                    curpos = curposStart + (this.textValue.length - originalTextValueLength);
                }
                setCursorPosition = true;
            }
        }

        // set a brieftimeout and set the current pos back to the field tricking the Change Detection
        if(setCursorPosition){
            setTimeout(() => {
                this.renderer.setProperty(this.numberinput.nativeElement, 'selectionEnd', curpos);
            });
        }
    }


    /**
     * Value is an integer when precision is 0
     */
    public isInteger(){
        if(this.precision <= 0 || this.precision === undefined) {
            return true;
        }
        return false;
    }


    /**
     * determines the pattern for allowed keys while entering the number
     * only necessary separators are enabled: an integer won't need the decimal separator
     */
    public defineInputPattern(){
        let pattern = "^[0-9";
        pattern+= this.userpreferences.toUse.num_grp_sep;
        if(!this.isInteger()){
            pattern+= this.userpreferences.toUse.dec_sep;
        }
        pattern+= "]+$";
        return pattern;
    }


}
