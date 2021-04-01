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
 * @module ObjectFields
 */
import {Component, ElementRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {popup} from "../../services/popup.service";

/**
 * renders a field for a numerical value and a timeunit. Used to define a timespan resp tiomediffernece that can later on be evaluated e.g. in Formulas, SLAs etc
 */
@Component({
    selector: 'field-time-difference',
    templateUrl: './src/objectfields/templates/fieldtimedifference.html'
})
export class fieldTimeDifference extends fieldGeneric {

    /**
     * internal to keep the unit
     */
    private _timedifferenceunit: string;

    /**
     * internal to keep the span
     */
    private _timedifferencespan: number;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * simpel getter speartaing the value
     */
    get timedifferenceunit() {
        if (this._timedifferenceunit) return this._timedifferenceunit;
        if (this.value) {
            return this.value.split(' ')[1];
        }
        return 'h';
    }

    /**
     * setter for the unit to also set the value of the model if thboth values are set
     *
     * @param value
     */
    set timedifferenceunit(value) {
        this._timedifferenceunit = value;
        this.updateModel();
    }

    /**
     * simple getter for teh value
     */
    get timedifferencespan() {
        if (this._timedifferencespan) return this._timedifferencespan;
        if (this.value) {
            return this.value.split(' ')[0];
        }
        return '';
    }

    /**
     * simple setter for teh value also setting the value field on the model
     *
     * @param value
     */
    set timedifferencespan(value) {
        this._timedifferencespan = value;
        this.updateModel();
    }

    /**
     * sets the model value via the value setter on the generic field
     */
    private updateModel() {
        if (this._timedifferencespan > 0 && this.timedifferenceunit) {
            this.value = this.timedifferencespan + ' ' + this._timedifferenceunit;
        } else {
            this.value = '';
        }
    }

}
