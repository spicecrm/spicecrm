/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSpiceMath
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostListener,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {userpreferences} from "../../../services/userpreferences.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

/**
 * display a calculator
 */


@Component({
    selector: 'spice-calculator',
    templateUrl: '../templates/spicecalculator.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SpiceCalculator)
        }
    ],
    animations: [
        trigger('slideInOutCalculatorRight', [
            state('openRight', style({width: '67%', 'margin-right': '12px'})),
            state('closedRight', style({width: '100%', 'margin-right': '12px'})),
            state('closedRightCompletely', style({width: '100%', 'margin-right': '12px'})),
            transition('openRight <=> closedRight', [
                animate('400ms'),
            ]),
            transition('openRight <=> closedRightCompletely', [
                animate('400ms'),
            ])
        ]),
        trigger('slideInOutCalculatorTop', [
            state('closedTop', style({width: '100%', height: '95%'})),
            state('ClosedCompletely', style({height: '100%'})),
            state('openTop', style({width: '100%', height: '66%'})),
            transition('openTop <=> closedTop', [
                animate('400ms')
            ]),
            transition('openTop <=> closedCompletely', [
                animate('400ms')
            ])
        ]),
        trigger('slideInOutHistory', [
            state('openRight', style({width: '30%', 'padding-left': '4px'})),
            state('closedRight', style({width: '0%', 'padding-left': '0'})),
            state('closedRightCompletely', style({width: '100%', 'padding-right': 0})),
            state('closedTop', style({height: 0})),
            state('openTop', style({height: '30%'})),
            transition('openTop <=> closedTop', [
                animate('400ms')
            ]),
            transition('openRight <=> closedRight', [
                animate('400ms'),
            ])
        ]),
        trigger('slideInOutHistoryPanelTop', [
            state('closedTop', style({height: '0', padding: 0})),
            state('openTop', style({height: '100%', padding: '4px'})),
            transition('openTop <=> closedTop', [
                animate('400ms')
            ])
        ])
    ]
})

export class SpiceCalculator implements ControlValueAccessor, AfterViewInit {
    /**
     * hold the history
     */
    public history: object[] = [];
    /**
     * holds the height adjusted fontSize for the subDisplay
     */
    public fontSizeSub: string = '300%';
    /**
     * holds the height adjusted fontSize for the mainDisplay
     */
    public fontSizeMain: string = '250%';
    /**
     * holds the current animationState for historySlide
     */
    public historyState: string;
    /**
     * holds the calculation string
     */
    public mainDisplayText: string = '';
    /**
     * holds the Decimal-Separator that the user has set
     */
    public readonly decimalSeparator: string;
    /**
     * indicates if history is open or closed
     */
    public showHistory: boolean = false;
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (val: string) => void;
    /**
     * indicates if calculator is opened as a modal
     */
    public fromModal: boolean = false;
    /**
     *holds the MainDisplay Parent-element
     */
    @ViewChild('mainDisParent') public mainDis1: ElementRef;
    /**
     *holds the MainDisplay-Element
     */
    @ViewChild('mainDis2') public mainDis2: ElementRef;
    /**
     *holds the subDisplay Parent-Element
     */
    @ViewChild('subDisParent') public subDis1: ElementRef;
    /**
     *holds the SubDisplay-Element
     */
    @ViewChild('subDis2') public subDis2: ElementRef;
    /**
     * check if a negate sign has been placed
     */
    public negateCheck: boolean = false;
    /**
     * check if history slides from the top or from the right
     */
    public size: boolean = false;
    /**
     * check if something was calculated
     */
    public check: boolean = false;
    /**
     * check if a operator has been placed
     */
    public opCheck: boolean = false;
    /**
     * check if calculator element is selected
     */
    public focus: boolean = false
    /**
     * holds the position of the operator
     */
    public opPosition: number;
    /**
     * check if a dot has been placed
     */
    public dotCheck: boolean = false;
    /**
     * keeps track of how many Numbers the current input has
     */
    public numCount: number = 0;
    /**
     * holds the Thousands-Separator that the user has set
     */
    public readonly separator: string;

    constructor(public cdRef: ChangeDetectorRef,
                public userPreferences: userpreferences,
                public el: ElementRef,) {
        this.decimalSeparator = this.userPreferences.toUse.dec_sep ?? '.';
        this.separator = (this.decimalSeparator === ',') ? '.' : ',';
    }

    /**
     * holds the current input value or result
     */
    public _value: string = '';

    /**
     * @return number of the local value
     */
    get value() {
        return this._value;
    }

    /**
     * set the local value and emit the changes
     * @param value
     */
    set value(value: any) {
        if (typeof value === 'number') {
            value = value.toString();
        }
        this._value = value;
        this.onChange(value);
    }

    /**
     * opens or closes the History
     */
    public slideHistory(dynamicWidth: boolean = true): void {
        this.showHistory = !this.showHistory;
        if (this.size) {
            this.historyState = this.showHistory ? 'openTop' : 'closedTop';
            this.cdRef.detectChanges();
        } else {
            this.historyState = this.showHistory ? 'openRight' : 'closedRight';
            this.cdRef.detectChanges();
        }
        if (dynamicWidth) {
            for (let i = 1; i <= 10; i++) {
                setTimeout(() => this.sizeCheck("dynamicWidth"), i * 40);
            }
            setTimeout(() => this.handleFontSize(), 400);
        }
    }

    ngAfterViewInit() {
        setTimeout(() => this.sizeCheck('all'), 10);
        this.showHistory = !this.showHistory;
        this.slideHistory();

        if(this.el.nativeElement.parentElement.id === 'modal') {
            this.focus = true;
            this.fromModal = true;
        }
    }

    /**
     * checks if font has to be adjusted and where to set the history position
     */
    public sizeCheck(font: 'all' | 'dynamicWidth') {
        const boxWidth: string = '0 0 ' + this.subDis1.nativeElement.getBoundingClientRect().width.toString() +
            ' ' + this.subDis1.nativeElement.getBoundingClientRect().height.toString();

        if (font === 'dynamicWidth') {
            if (this.mainDis1.nativeElement.attributes['viewBox'].value === boxWidth) {
                return;
            }
            this.mainDis1.nativeElement.attributes['viewBox'].value = boxWidth;
            this.subDis1.nativeElement.attributes['viewBox'].value = boxWidth;
            this.handleFontSize();
            return this.sizeCheck('dynamicWidth');
        }

        this.mainDis1.nativeElement.attributes['viewBox'].value = boxWidth;
        this.subDis1.nativeElement.attributes['viewBox'].value = boxWidth;

        this.handleFontSize();

        if (this.el.nativeElement !== undefined) {
            if (this.el.nativeElement.getBoundingClientRect().width <= 375 && !this.size) {
                this.size = true;
                this.showHistory = !this.showHistory;
                setTimeout(() => this.slideHistory(false), 10);
            } else if (this.el.nativeElement.getBoundingClientRect().width > 375 && this.size) {
                this.size = false;
                this.showHistory = !this.showHistory;
                setTimeout(() => this.slideHistory(false), 10);
            }
        }
    }

    /**
     * deletes History
     */
    public deleteHistory(): void {
        this.history = [];
    }

    /**
     * register on change ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * register on touched ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: number): void {
    }

    /**
     * set the local value ControlValueAccessor
     * @param value
     */
    public writeValue(value: string): void {
        if (value !== null && value !== undefined) {
            this._value = this.setSeparators(value);
        } else {
            this._value = '';
        }
        this.cdRef.detectChanges();
    }

    /**
     * deletes the last sign
     */
    public delete(): void {
        // blocks if delete makes no sense
        if (this.value.search(/Infinity/) !== -1 || this.value === 'Undefined Result' || this.check || (this.value === '' && this.mainDisplayText === '')) return;
        const delSign = this.value.slice(0, -1);

        // handles delete process if the current input string is empty
        if (this.value === '') {
            this.value = this.mainDisplayText.slice(0, -1);
            this.mainDisplayText = '';
            this.negateCheck = true;
            this.dotCheck = this.value.split(this.decimalSeparator).length === 2;
            this.numCount = this.mainDisplayText.slice(0, -1).split(this.separator).join('').split(this.decimalSeparator).join('').length;
            this.opCheck = false;

            //handles delete process if current input string has length one
        } else if (this.value.length === 1) {
            this.negateCheck = false;
            this.value = '';

            // handles delete process if current input string is longer than one
        } else {
            if (delSign === this.decimalSeparator) {
                this.dotCheck = false;
            }
            this.value = this.setSeparators(this.value.slice(0, -1));
        }

        if (!isNaN(parseFloat(delSign))) this.numCount -= 1;
        this.subDis2.nativeElement.attributes["font-size"].value = this.fontSizeSub;
        this.handleOverflow('sub');
    }

    /**
     * handles the input signs and checks wether they can be placed or not
     */
    public onKeyPress(sign): void {
        // blocks further calculation interactions if current result is 'Infinity' or 'Undefined' Result
        if (this.value.search(/Infinity/) !== -1 || this.value === 'Undefined Result') {
            if (sign === this.mainDisplayText[this.opPosition - 1]) {

                this.value = '';
                this.mainDisplayText = this.mainDisplayText.slice(0, this.opPosition -1) + sign;

                this.negateCheck = false;

                this.numCount = 0;

            } else if(isNaN(sign)) {
                return;

            } else if (!isNaN(sign)) {

                this.value = sign;
                this.mainDisplayText = this.mainDisplayText.slice(0, this.opPosition);

                this.negateCheck = true;

                this.numCount = 1;
            }

            this.check = false;
            this.dotCheck = false;

            this.subDis2.nativeElement.attributes["font-size"].value = this.fontSizeSub;
            this.mainDis2.nativeElement.attributes["font-size"].value = this.fontSizeMain;

            setTimeout(() => this.handleOverflow("main"), 10);

            return;
        }

        const lastSign = (!this.value) ? ((!this.mainDisplayText) ? '' : this.mainDisplayText.slice(-1)) : this.value.slice(-1);

        // blocks setting a Decimal-Separator if a result is displayed
        if (sign === this.decimalSeparator && this.check) return;

        // checks if a negate sign can be set
        if (sign === '-' && !this.negateCheck) {

            this.value += '-';
            this.negateCheck = true;

            // handles operators
        } else if (['+', '*', '/', '-'].indexOf(sign) !== -1) {

            // blocs an operator to be set right after an Decimal-Separator
            if (this.value.slice(-1) === this.decimalSeparator) return;

            // replaces the old operator if a new one is set right after the old
            if (['+', '*', '/', '-', ''].indexOf(lastSign) !== -1) {

                if (sign === '-' || lastSign === '' || this.value !== '') return;
                this.mainDisplayText = this.mainDisplayText.slice(0, -1) + sign;
                return;

            } else {

                // if a result is displayed a new calculation with the result as rightSide gets initiated
                if (this.check && !parseFloat(sign)) {
                    this.mainDisplayText = '';
                }
                const calc = this.calculate('operator');

                if(['Infinity', '-Infinity', 'Undefined Result'].indexOf(calc) !== -1) {
                    this.check = true;
                    return;
                }

                this.mainDisplayText = ((!this.opCheck) ? this.value : this.calculate('operator')) + sign;
                this.value = '';

                this.opPosition = this.mainDisplayText.length;
                this.opCheck = true;

                this.negateCheck = false;
                this.dotCheck = false;
                this.check = false;

                this.numCount = 0;

                this.subDis2.nativeElement.attributes["font-size"].value = this.fontSizeSub;
                this.mainDis2.nativeElement.attributes["font-size"].value = this.fontSizeMain;
                setTimeout(() => this.handleOverflow("main"), 10);
                return;
            }

            // blocks a Decimal-Separator to be set right after an operator or another Decimal-Separator
        } else if ((['+', '*', '/', '-', '', this.decimalSeparator].indexOf(lastSign) !== -1 && sign === this.decimalSeparator) ||
            (this.dotCheck && sign === this.decimalSeparator) || this.numCount >= 16) {
            return;

            // initiates a new calculation if a number gets entered and a result is displayed
        } else if (this.check) {

            this.setSettings('default');

            this.value = sign;

            this.negateCheck = true;

            this.numCount = 1;

            // blocks a zero to be the first character of a number
        } else if (lastSign === '0' && !this.dotCheck && this.value.length === 1) {
            if (sign === '0') return;

            else if (!isNaN(parseInt(sign))) this.value = sign;

            else this.value += sign;

            // handles normal number and Decimal-Separator inputs
        } else {
            // handles Decimal-Separators
            if (sign === this.decimalSeparator) {

                this.dotCheck = true;

                this.numCount -= 1;
            }

            this.value += sign;

            this.negateCheck = true;

            this.numCount += 1;

        }
        if (this.history.length === 0) setTimeout(() => this.handleFontSize(), 10);
        this.value = this.setSeparators(this.value);

        setTimeout(() => this.handleOverflow('sub'), 10);
    }

    /**
     * calculates the result
     */
    public calculate(cause: 'enter' | 'operator') {

        let op: string = this.mainDisplayText[this.opPosition - 1];
        let leftSide: number;
        let rightSide: number;


        // blocks calculation if it does not makes sense
        if (this.value === '' || this.mainDisplayText === '' || this.value.search(/Infinity/) !== -1 || this.value === 'Undefined Result' ||
            this.value.slice(0, -1) === this.decimalSeparator || isNaN(parseInt(this.value[this.value.length - 1]))) return;

        // takes the result and does the same operation from last time if a result is displayed and the user wants to calculate again
        if (this.check) {

            leftSide = parseFloat(this.value.split(this.separator).join('').split(this.decimalSeparator).join('.'));
            rightSide = parseFloat(this.mainDisplayText.slice(this.opPosition, -1).split(this.separator).join('').split(this.decimalSeparator).join('.'));

            this.mainDisplayText = this.value + op + this.mainDisplayText.substring(this.opPosition);
            this.opPosition = this.value.length + 1;

            // handles a normal calculation
        } else {

            leftSide = parseFloat(this.mainDisplayText.slice(0, -1).split(this.separator).join('').split(this.decimalSeparator).join('.'));
            rightSide = parseFloat(this.value.split(this.separator).join('').split(this.decimalSeparator).join('.'));

            this.mainDisplayText += this.value + '=';
        }

        let result;
        switch (op) {

            case '+':
                result = leftSide + rightSide;
                break;

            case '-':
                result = leftSide - rightSide;
                break;

            case '*':
                result = leftSide * rightSide;
                break;

            case '/':
                result = leftSide / rightSide;
                break;

            default:
                console.log('calculation Error');
        }

        // checks if result is a number
        if (isNaN(result) || result === (Infinity || -Infinity)) {
            result = isNaN(result)? 'Undefined Result' : 'Infinity';
            this.value = result;
        } else result = this.setSeparators(this.checkZeros(result.toString()).split('.').join(this.decimalSeparator));


        // defines output if calculation was started because of an operator
        if (cause === 'operator') {
            this.value = result;

            this.check = false;

            this.addToHistory();
            return result;
        }

        this.setSettings('calculation');

        this.value = result;

        this.addToHistory();

        setTimeout(() => {
            this.handleOverflow("main");
            this.handleOverflow('sub')
        }, 10);
    }

    /**
     * resets settings to default or calculation, depending on the input
     */
    public setSettings(detail: 'default' | 'calculation' | 'value'): void {
        switch (detail) {

            case 'default':
                this.mainDisplayText = '';
                this.value = '';

                this.opPosition = null;

                this.check = false;
                this.negateCheck = false;
                this.opCheck = false;
                this.dotCheck = false;

                this.numCount = 0;

                this.subDis2.nativeElement.attributes["font-size"].value = this.fontSizeSub;
                this.mainDis2.nativeElement.attributes["font-size"].value = this.fontSizeMain;

                break;

            case 'calculation':
                this.check = true;
                this.negateCheck = true;
                this.opCheck = false;
                this.dotCheck = false;

                this.numCount = 0;

                this.subDis2.nativeElement.attributes["font-size"].value = this.fontSizeSub;
                this.mainDis2.nativeElement.attributes["font-size"].value = this.fontSizeMain;

                break;

            case 'value':
                if (this.check) this.setSettings('default');

                this.value = ''

                this.negateCheck = false;
                this.dotCheck = false;

                this.subDis2.nativeElement.attributes["font-size"].value = this.fontSizeSub;
        }
    }

    @HostListener('window:click', ['$event.target']) onClick(event: string) {
        if(this.fromModal) return;
        this.focus = this.el.nativeElement.contains(event);
    }

    /**
     * listens to keydown events then filters keys and passes them to onKeyPress
     */
    @HostListener('window:keydown', ['$event']) KeyEvent(event: KeyboardEvent): void {

        if (!this.focus) return;

        const numbers: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

        if (event.key === 'c' && event.ctrlKey) {

            navigator.clipboard.writeText(this.value).then();
            event.preventDefault();

        } else if (event.key === '-' && event.ctrlKey) {

            this.negate();
            event.preventDefault();

        } else if(event.ctrlKey && event.key === 'e') {
            this.setSettings('value');
            event.preventDefault();

        } else if (event.ctrlKey) {
            return;

        } else if (numbers.indexOf(event.key) !== -1) {

            this.onKeyPress(event.key);
            event.preventDefault();

        } else if (['+', '*', '/', '-', this.decimalSeparator].indexOf(event.key) !== -1) {

            this.onKeyPress(event.key);
            event.preventDefault();

        } else if (event.key === 'Enter') {

            this.calculate('enter');
            event.preventDefault();

        } else if (event.key === 'c' || event.key === 'C') {

            this.setSettings('default');
            event.preventDefault();

        } else if (event.key === 'Backspace') {

            this.delete();
            event.preventDefault();
        }
    }

    /**
     * decreases font-size if text is too big for the parent element
     */
    public handleOverflow(element: 'sub' | 'main') {

        if (element === 'sub') {

            const parWidth: number = this.subDis1.nativeElement.getBoundingClientRect().width;
            const childWidth: number = this.subDis2.nativeElement.getBoundingClientRect().width;
            const size: number = parseFloat(this.subDis2.nativeElement.attributes['font-size'].value.slice(0, -1));

            if (parWidth - 5 <= childWidth) {

                this.subDis2.nativeElement.attributes["font-size"].value = (size * 0.99).toString() + '%';

                return this.handleOverflow(element);
            }
        } else {

            const parWidth: number = this.mainDis1.nativeElement.getBoundingClientRect().width;
            const childWidth: number = this.mainDis2.nativeElement.getBoundingClientRect().width;
            const size: number = parseFloat(this.mainDis2.nativeElement.attributes['font-size'].value.slice(0, -1));

            if (parWidth - 5 <= childWidth) {

                this.mainDis2.nativeElement.attributes["font-size"].value = (size * 0.99).toString() + '%';

                return this.handleOverflow(element);
            }
        }
    }

    /**
     * adjusts the fontSize to display-height
     */
    public handleFontSize() {
        const fontSizeSub: number = parseFloat(this.fontSizeSub.slice(0, -1));

        if (this.subDis2.nativeElement.getBoundingClientRect().height !== 0 && this.subDis2.nativeElement.getBoundingClientRect().height < this.subDis1.nativeElement.getBoundingClientRect().height * 0.9) {

            this.fontSizeSub = (fontSizeSub * 1.1).toString() + '%';
            this.subDis2.nativeElement.attributes['font-size'].value = this.fontSizeSub;
            this.fontSizeMain = (fontSizeSub * 0.8).toString() + '%';
            this.mainDis2.nativeElement.attributes['font-size'].value = (fontSizeSub * 0.8).toString() + '%';

            return this.handleFontSize();
        }

        if (this.subDis2.nativeElement.getBoundingClientRect().height > this.subDis1.nativeElement.getBoundingClientRect().height * 1.1) {

            this.fontSizeSub = (fontSizeSub * 0.9).toString() + '%';
            this.subDis2.nativeElement.attributes['font-size'].value = this.fontSizeSub;
            this.fontSizeMain = (fontSizeSub * 0.8).toString() + '%';
            this.mainDis2.nativeElement.attributes['font-size'].value = (fontSizeSub * 0.8).toString() + '%';

            return this.handleFontSize();
        }
    }

    /**
     * restores settings and calculation values from History
     */
    public restoreHistory(index: number): void {

        this.setSettings('calculation');

        // @ts-ignore
        this.value = this.history[index].value;

        // @ts-ignore
        this.mainDisplayText = this.history[index].mainDisplay;
    }

    /**
     * adds the current calculation to the history
     */
    public addToHistory(): void {

        this.history.unshift({
            'value': this.value,
            'mainDisplay': this.mainDisplayText
        });
    }

    /**
     * negates the result
     */
    public negate(): void {
        if (this.value.search(/Infinity/) !== -1 || this.value === 'Undefined Result') return;

        if (this.check) {

            this.value = this.setSeparators((parseFloat(this.value.split(this.decimalSeparator).join('.')) * -1)
                .toString().split('.').join(this.decimalSeparator));
        }
    }

    /**
     * manages percent calculations
     */
    public percent(): void {

        if (!this.opCheck || (['-', '+', '*', '/'].indexOf(this.mainDisplayText.slice(-1)) && !this.value)) return;

        let percent: number = parseFloat(this.value.split(this.separator).join('').split(this.decimalSeparator).join('.')) / 100;

        if (this.mainDisplayText[this.opPosition - 1] === '+' || this.mainDisplayText[this.opPosition - 1] === '-') {

            const mainDis = this.mainDisplayText.slice(0, -1).split(this.separator).join('').split(this.decimalSeparator).join('.');

            percent = parseFloat(mainDis) * percent;
        }

        this.value = this.setSeparators(percent.toString().split('.').join(this.decimalSeparator));
        this.dotCheck = this.value.indexOf(this.decimalSeparator) !== -1;
        setTimeout(() => {
            this.handleOverflow('sub');
            this.handleOverflow('main');
        }, 10);
    }

    /**
     * sets Thousands- and Decimal-Separators depending on User preferences
     */
    public setSeparators(number: string): string {

        // blocks separation if number is 'Infinity' or 'Undefined Result'
        if (number.search(/Infinity/) !== -1 || number === 'Undefined Result') return number;

        let seperated: string[] = number.split(this.decimalSeparator);

        if (number[0] === '-') {
            seperated = number.substring(1).split(this.decimalSeparator);
        }

        if (number.search(/e[+]\d+/) !== -1) {
            seperated = number.substring(0, number.search(/e[+]\d+/)).split(this.decimalSeparator);
        }

        let leftCount = seperated[0].length;
        let left = seperated[0].split(this.separator).join('');

        if (leftCount > 3) {

            let leftList: string[] = [];

            for (let i = 1; i <= left.length; i++) {
                if (i % 3 === 0) {
                    leftList.unshift(left.substring(left.length - i, 3))
                }
            }

            left = (left.length === (leftList.length * 3)) ? leftList.join(this.separator) :
                left.substring(0, left.length - leftList.length * 3) + this.separator + leftList.join(this.separator);

            seperated.splice(0, 1, left);

            return ((number[0] === '-') ? '-' : '') + seperated.join(this.decimalSeparator);
        }
        return number;
    }

    /**
     * checks if the calculation has calculated to many zeros and cuts them out
     */
    public checkZeros(number: string): string {
        if (number.indexOf(this.decimalSeparator) !== -1) {

            const preComDigits = number.substring(0, number.indexOf(this.decimalSeparator));
            const postComDigits = number.substring(number.indexOf(this.decimalSeparator));

            number = (number.search(/000000/) !== -1) ? preComDigits +
                postComDigits.substring(0, postComDigits.search(/000000/)) : number;

        }
        return number;
    }
}

