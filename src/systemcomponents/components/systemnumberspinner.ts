/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSpicePath
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {userpreferences} from '../../services/userpreferences.service';
import {interval} from "rxjs";
import {take} from "rxjs/operators";

declare var _: any;

/**
 * spins a number up and down and outputs it number formatted
 */
@Component({
    selector: 'system-number-spinner',
    templateUrl: './src/systemcomponents/templates/systemnumberspinner.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemNumberSpinner implements OnChanges {

    /**
     * the internal held value
     */
    private _value: number = 0;

    /**
     * the number to be displayed
     */
    @Input() private value: any;

    /**
     * the steps this is running by
     */
    @Input() private steps: number = 20;

    /**
     * the animation duration in ms
     */
    @Input() private duration: number = 300;

    constructor(private userpreferences: userpreferences, private cdref: ChangeDetectorRef) {
    }

    /**
     * register on changes to trigger the counter
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        const _increment = (parseFloat(this.value) - this._value) / this.steps;
        interval(this.duration / this.steps).pipe(take(this.steps)).subscribe(cx => {
            // make sure we only increment if we still have a deviating number
            if (this._value != parseFloat(this.value)) {
                this._value += _increment;

                // check if we are close enough then set the value to the same avoiding rounding errors
                if (Math.abs(this._value - parseFloat(this.value)) < 1) {
                    this._value = parseFloat(this.value);
                }

                // trigger change detection
                this.cdref.detectChanges();
            }
        }, error => {
            // in case something happened .. just ensure we set the proper value
            this._value = parseFloat(this.value);
            // trigger change detection
            this.cdref.detectChanges();
        }, () => {
            // in case the subscription completed and we have another value
            this._value = parseFloat(this.value);
            // trigger change detection
            this.cdref.detectChanges();
        });
    }

    /**
     * returns the formatted value
     */
    get displayvalue() {
        return this.userpreferences.formatMoney(this._value, 0);
    }
}
