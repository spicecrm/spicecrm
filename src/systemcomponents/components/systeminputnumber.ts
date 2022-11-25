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
     * and might impact the content of the field
     */
    public allowedKeys: any[] = ['ArrowRight', 'ArrowLeft', 'Backspace', 'Delete', 'Tab'];

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
        let originalTextValue = this.textValue;

        // in case the input content was selected, then a key stroke, there shall not be any value in the decimalKeyStroke.
        // Therefore reset
        if(curposStartDecimalKeyStroke < 0){
            this.resetDecimalCounter();
        }

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
            this.calculateCursorPosition(curpos, curposStart, curposStartDecimalKeyStroke, originalTextValue);
        }
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
            this.resetDecimalCounter();
        } else {
            numberValue = (Math.floor(numberValue * Math.pow(10, defSigDigits)) / Math.pow(10, defSigDigits));
        }

        numberValue = numberValue && numberValue > this.max ? this.max : numberValue;
        numberValue = numberValue && numberValue < this.min ? this.min : numberValue;
        return this.getValAsText(numberValue);
    }

    /**
     * convert the number value into a text value
     * @param textValue
     */
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
        // store stroke key
        this.latestKeyStroke = e.key;

        // Check on allowed chars: digits and separators
        let regex = new RegExp(this.defineInputPattern(),"g");
        if (!regex.test(e.key) && this.allowedKeys.indexOf(e.key) < 0) {
            this.resetDecimalCounter();
            e.preventDefault(); // abort any further action
            return false;
        }

        // check on backspace/delete of decimal separator and just reposition cursor
        if(this.moveCursorOnDecimalSeparatorRemove()){
            e.preventDefault();
            return false;
        };

        // check on precision and just ignore any additional decimal digit
        if(this.removeDecimalDigits()){
            e.preventDefault();
            return false;
        };

        // increment counter for decimal digits
        if(this.decimalKeyStroke == this.userpreferences.toUse.dec_sep){
            this.counterAfterdecimalKeyStroke++;
            if(this.counterAfterdecimalKeyStroke > this.precision){
                this.counterAfterdecimalKeyStroke = 1;
            }
        }

        // initialize counter for digits after decimal separator
        if(e.key == this.userpreferences.toUse.dec_sep){
            this.decimalKeyStroke = e.key;
            this.counterAfterdecimalKeyStroke = 0;
            if(this.textValue.split(this.userpreferences.toUse.dec_sep).length > 0){
                // set cursor after decimal separator
                let curpos = this.textValue.indexOf(this.userpreferences.toUse.dec_sep) + 1;
                this.setCursorPosition(curpos);
                this.resetDecimalCounter();
                // do not write the decimal separator since it is already present
                e.preventDefault();
                return false;
            }
        }
    }


    /**
     * recalculate cursor position:
     * we position after latest entered digit
     * we reposition only when user is not moving cursor using arrows
     * we consider the position of the decimal separator when there is one
     */
    public calculateCursorPosition(curpos, curposStart, curposStartDecimalKeyStroke, originalTextValue){
        let curposEndDecimalKeyStroke = this.textValue.indexOf(this.userpreferences.toUse.dec_sep);
        let setCursorPosition = false;
        let lengthChange = this.textValue.length - originalTextValue.length;
        let originalTextValueNumGrpSepCount = originalTextValue.split(this.userpreferences.toUse.num_grp_sep).length;
        let textValueNumGrpSepCount = this.textValue.split(this.userpreferences.toUse.num_grp_sep).length;
        let diffNumGrpSepCount = originalTextValueNumGrpSepCount - textValueNumGrpSepCount;

        // key stroke is known of the exception allowedKeys
        if(this.allowedKeys.indexOf(this.latestKeyStroke) < 0){
            if(!this.isInteger()) {
                if (this.decimalKeyStroke == '' && curposEndDecimalKeyStroke > 0) {
                    // editing existing value
                    curpos = curposStart;
                    if (curposStartDecimalKeyStroke > 0) {
                        curpos = curpos + (curposEndDecimalKeyStroke - curposStartDecimalKeyStroke);
                    }
                    setCursorPosition = true;
                }
            } else{
                curpos = curposStart + lengthChange;
                setCursorPosition = true;
            }

        } else{
            // user is removing a char
            if(this.onBackspace() || this.onDelete()){
                // reset
                this.resetDecimalCounter();
                // calculate position
                curpos = curposStart;

                // on length change consider the count of num group separator
                if(lengthChange < 0) {
                    curpos = curposStart - diffNumGrpSepCount;
                }

                // Case when we selected part of the string with a number having a num group separator
                // And the result after delete is a number still containing the same amount of num group separators
                // Example: 126,459.78 - I select 6,4 and press delete key - result is 1,259.78 - I expect the cursor after the 2
                if(lengthChange > 0 && diffNumGrpSepCount < 0) {
                    curpos = curpos + Math.abs(diffNumGrpSepCount);
                }

                // if we are at the beginning of string, position remains 0
                if(curposStart == 0){
                    curpos = 0;
                }

                setCursorPosition = true;
            }
        }

        // position the cursor
        if(setCursorPosition){
            this.setCursorPosition(curpos);
        }
    }

    /**
     * set a brieftimeout and set the current pos back to the field tricking the Change Detection
     * set start and end to avoid text to be marked a selected after change event
     * @param curpos
     */
    public setCursorPosition(curpos){
        setTimeout(() => {
            this.renderer.setProperty(this.numberinput.nativeElement, 'selectionStart', curpos);
            this.renderer.setProperty(this.numberinput.nativeElement, 'selectionEnd', curpos);
        });
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

    /**
     * reset the values for decimal key stroke monitoring
     */
    public resetDecimalCounter(){
        this.decimalKeyStroke = '';
        this.counterAfterdecimalKeyStroke = 0;
    }

    /**
     * checks if latest key stroke is Delete
     */
    public onDelete(){
        if(this.latestKeyStroke == 'Delete'){
            return true;
        }
        return false;
    }

    /**
     * checks if latest key stroke is Backspace
     */
    public onBackspace(){
        if(this.latestKeyStroke == 'Backspace'){
            return true;
        }
        return false;
    }

    /**
     * When the user hits backspace or delete
     * We catch if the char to be removed is the decimal separator
     * In that case we should only reposition the cursor and not remove the decimal separator
     */
    public moveCursorOnDecimalSeparatorRemove(){
        if(!this.isInteger()){
            let eventKey = this.latestKeyStroke;
            if(!this.onBackspace() && !this.onDelete()){
                return false;
            }

            let cursorStartPosition = this.numberinput.nativeElement.selectionStart;
            let decSepPosition = this.textValue.indexOf(this.userpreferences.toUse.dec_sep);
            let cursorPositionIncrementor = 0;

            if(this.onBackspace() && cursorStartPosition == (decSepPosition+1)){
                cursorPositionIncrementor = -1;
            } else if(this.onDelete() && cursorStartPosition == (decSepPosition)){
                cursorPositionIncrementor = 1;
            }
            if(cursorPositionIncrementor != 0){
                this.setCursorPosition(cursorStartPosition+cursorPositionIncrementor);
                return true;
            }
        }
        return false;
    }

    /**
     * check on precision
     * If the start position is the end the string, we will refuse any further digit
     * but still accept arrows, backspace. tab...
     */
    public removeDecimalDigits(){
        if(this.isInteger() || this.textValue.length <= 0) { // no decimal separator
            return false;
        }
        let cursorStartPosition = this.numberinput.nativeElement.selectionStart;

        if(cursorStartPosition == this.textValue.length &&
            this.allowedKeys.indexOf(this.latestKeyStroke) < 0
        ){
            return true;
        }
        return false;
    }

}
