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
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {Component, ElementRef, forwardRef, OnDestroy, Renderer2,} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";
import {modal} from "../../services/modal.service";
import {take} from "rxjs/operators";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "system-input-date",
    templateUrl: "./src/systemcomponents/templates/systeminputdate.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputDate),
            multi: true
        }
    ]
})
export class SystemInputDate implements OnDestroy, ControlValueAccessor {


    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;
    private showCalendarButton: boolean = true;
    private _date: any = {
        display: '',
        moment: null,
        valid: true
    };

    // for the dropdown
    private isOpen: boolean = false;
    private clickListener: any;

    constructor(private elementref: ElementRef,
                private renderer: Renderer2,
                private userpreferences: userpreferences,
                private modal: modal,
                private language: language) {
    }

    get isValid() {
        return this._date.valid;
    }

    get display() {
        return this._date.display ? this._date.display : '';
    }

    set display(value) {
        if (value) {
            // try to parse the value
            let newDate = moment(value, this.userpreferences.getDateFormat(), true);
            if (newDate.isValid()) {
                if (!this._date.moment) {
                    this._date.moment = new moment();
                }
                this._date.moment.year(newDate.year()).month(newDate.month()).date(newDate.date());
                this._date.valid = true;

                // close the dropdown
                this.toggleClosed();

                // emit the value to the ngModel directive
                if (typeof this.onChange === 'function') {
                    this.onChange(this._date.moment);
                }

            } else {
                this._date.display = value;
                this._date.valid = false;
            }
        } else {
            this.clear();
        }
    }

    get canclear() {
        return !!this._date.display;
    }

    /**
     * determines the side (left or right) for the dropdown depending how much space is left for the element
     */
    get dropdownside() {
        let erect = this.elementref.nativeElement.getBoundingClientRect();
        if (window.innerWidth - erect.left < 280) {
            return 'slds-dropdown_right';
        } else {
            return 'slds-dropdown_left';
        }
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
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
        // this._time = value ? value : '';
        if (value && value.isValid && value.isValid()) {
            this._date.moment = new moment(value);
            this._date.display = this._date.moment.format(this.userpreferences.getDateFormat());
        } else {
            this.clear(false);
        }
    }

    private clear(notify = true) {
        this._date.moment = null;
        this._date.display = '';
        this._date.valid = true;

        // emit the value to the ngModel directive
        if (typeof this.onChange === 'function' && notify) {
            this.onChange(this._date.moment);
        }
    }

    /**
     *  focus the text area when the editor is focussed
     */
    private toggleOpen() {

        this.isOpen = !this.isOpen;
        // check if we are active already
        if (this.isOpen) {
            // listen to the click event if it is ousoide of the current elements scope
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
        }
    }

    private toggleClosed() {
        // close the dropdown
        this.isOpen = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private onDocumentClick(event: MouseEvent) {
        if (this.isOpen && !this.elementref.nativeElement.contains(event.target)) {
            this.isOpen = false;
            this.clickListener();
        }
    }

    private datePicked(value, fromCalendar?: boolean) {
        if (value) {
            if (!this._date.moment) {
                this._date.moment = new moment();
            }
            if (!moment.isMoment(value)) value = moment(value);

            this._date.moment.set('year', value.year());
            this._date.moment.set('month', value.month());
            this._date.moment.set('date', value.date());
            if (fromCalendar) {
                this._date.moment.set('hour', value.hour());
                this._date.moment.set('minute', value.minute());
            }
            this._date.display = this._date.moment.format(this.userpreferences.getDateFormat());
            this._date.valid = true;

            // emit the value to the ngModel directive
            if (typeof this.onChange === 'function') {
                this.onChange(this._date.moment);
            }

            // close the dropdown
            this.toggleClosed();
        }
    }

    private openCalendar() {
        this.toggleClosed();
        this.modal.openModal('Calendar').subscribe(modalRef => {
            modalRef.instance.asPicker = true;
            modalRef.instance.calendar.pickerDate$
                .pipe(take(1))
                .subscribe(date => {
                    modalRef.instance.asPicker = false;
                    this.datePicked(date, true);
                });
        });
    }

}
