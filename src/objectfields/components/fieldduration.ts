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
import {Component, ElementRef, Renderer2} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

/**
* @ignore
*/
/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'field-duration',
    templateUrl: './src/objectfields/templates/fieldduration.html',

})
export class fieldDuration extends fieldGeneric {
    private isValid: boolean = true;
    private durationHours: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    private durationMinutes: string[] = ['00', '15', '30', '45'];

    get fieldminutes() {
        return this.fieldconfig.field_minutes ? this.fieldconfig.field_minutes : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig.field_hours ? this.fieldconfig.field_hours : 'duration_hours';
    }

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    private getDisplay() {
        if (this.model.data[this.fieldminutes] || this.model.data[this.fieldhours]) {
            // return this.model.data[this.fieldhours] + ':' + this.model.data[this.fieldminutes];
            return ("00" + this.model.data[this.fieldhours]).slice(-2)  + ':' + ("00" + this.model.data[this.fieldminutes]).slice(-2);
        }
    }

    /*
     * toggle the datepicker and subscribe to the close event
     */


    get editDurationHours() {
        return this.model.data[this.fieldhours];
    }

    set editDurationHours(hours) {
        this.model.setField(this.fieldhours, hours);
    }

    get editDurationMinutes() {
        return this.model.data[this.fieldminutes];
    }

    set editDurationMinutes(minutes) {
        this.model.setField(this.fieldminutes, minutes);
    }

}
