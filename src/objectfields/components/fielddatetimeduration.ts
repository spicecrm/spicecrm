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
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {userpreferences} from '../../services/userpreferences.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'field-date-time-duration',
    templateUrl: './src/objectfields/templates/fielddatetimeduration.html'
})
export class fieldDateTimeDuration extends fieldGeneric {
    /**
     * values for the duration in hours
     */
    private durationHours: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    /**
     * values for the duration in minutes
     */
    private durationMinutes: string[] = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    get fieldstart() {
        return this.fieldconfig.field_start ? this.fieldconfig.field_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.field_end ? this.fieldconfig.field_end : 'date_end';
    }

    get fieldminutes() {
        return this.fieldconfig.field_minutes ? this.fieldconfig.field_minutes : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig.field_hours ? this.fieldconfig.field_hours : 'duration_hours';
    }

    get minutes() {
        let minutes = 0;
        if (this.model.data[this.fieldhours]) {
            minutes += parseInt(this.model.data[this.fieldhours], 10) * 60;
        }
        if (this.model.data[this.fieldminutes]) {
            minutes += parseInt(this.model.data[this.fieldminutes], 10);
        }

        return minutes;
    }

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

    private getDisplay() {
        if (this.model.data.date_start) {
            if (!this.model.data.date_end) {
                this.model.data[this.fieldend] = new moment(this.model.data.date_start).add(this.minutes, 'm');
            }

            return this.model.data.date_start.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat()) + ' - ' + this.model.data.date_end.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
        }
    }

}
