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
import {ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {userpreferences} from "../../../services/userpreferences.service";

/**
 * display a calculator modal
 */
@Component({
    selector: 'spice-calculator-modal',
    templateUrl: '../templates/spicecalculatormodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceCalculatorModal {
    public readonly decimalSeparator: string;
    public readonly seperator: string;

    @ViewChild('calculator') spicecalculator;

    constructor(public userPreferences: userpreferences) {
        this.decimalSeparator = this.userPreferences.toUse.dec_sep ?? '.';
        this.seperator = (this.decimalSeparator === ',')? '.' : ',';
    }
    /**
     * holds the calculated value
     */
    public value: string;

    /**
     * checks if the modal got opened by SystemCalculatorTrigger
     */
    public trigger: boolean = false;
    /**
     * holds a reference of this component to enable destroy
     */
    public self;
    /**
     * holds a subject object for the value emission
     * @private
     */
    public valueSubject = new Subject<number>();
    /**
     * holds a value observable
     */
    public value$: Observable<number> = this.valueSubject.asObservable();

    /**
     * destroy the modal
     */
    public cancel() {
        this.self.destroy();
    }

    public setValue(event) {
        this.value = event;
    }

    public apply() {
        this.valueSubject.next(parseFloat(this.value.split(this.seperator).join('').split(this.decimalSeparator).join('.')));
        this.valueSubject.complete();
        this.cancel();
    }
}
