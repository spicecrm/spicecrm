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
import {Component, OnInit} from '@angular/core';
import {userpreferences} from "../../services/userpreferences.service";
import {fieldGeneric} from './fieldgeneric';
import {view} from "../../services/view.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {Router} from "@angular/router";

/**
 * @ignore
 */
/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'field-date-time-span',
    templateUrl: './src/objectfields/templates/fielddatetimespan.html'
})
export class fieldDateTimeSpan extends fieldGeneric implements OnInit {
    private isValid: boolean = true;
    private errorMessage: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    get fieldstart() {
        return this.fieldconfig.date_start ? this.fieldconfig.date_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.date_end ? this.fieldconfig.date_end : 'date_end';
    }

    get fieldminutes() {
        return this.fieldconfig.duration_minutes ? this.fieldconfig.duration_minutes : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig.duration_hours ? this.fieldconfig.duration_hours : 'duration_hours';
    }

    public ngOnInit() {
        this.calculateEndDate();
    }

    get duration() {
        let hours = this.model.getFieldValue(this.fieldhours);
        let minutes = this.model.getFieldValue(this.fieldminutes);

        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    }

    get formattedStartDate() {
        return this.startDate ? this.startDate.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat()) : '';
    }

    get formattedEndDate() {
        return this.endDate ? this.endDate.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat()) : '';
    }

    get startDate() {
        return this.model.getField(this.fieldstart);
    }

    set startDate(date) {
        this.model.setField(this.fieldstart, date);
        this.calculateEndDate();
        // console.log('start set');
    }

    get endDate() {
        return this.model.getField(this.fieldend);
    }

    set endDate(date) {
        // if startdate is not set .. set it ...
        if (!this.model.getFieldValue(this.fieldstart)) {
            this.startDate = new moment(date).subtract(this.duration, 'minutes');
        }

        if (date.isBefore(this.model.getFieldValue(this.fieldstart))) {
            this.isValid = false;
            this.errorMessage = 'enddate cannot be before startdate';
            this.model.setFieldMessage('error', 'enddate cannot be before startdate', this.fieldname, 'sequencecheck');
            // this.calculateEndDate();
        } else {
            this.model.resetFieldMessages(this.fieldname, 'error', 'sequencecheck');
            this.model.setField(this.fieldend, date);
            this.calculateDuration();
            this.isValid = true;
        }
    }


    get stati() {
        let stati = this.model.getFieldStati(this.fieldname);

        if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
            stati.editable = false;
        }

        // add required flag if set via fieldconfig
        if (this.fieldconfig.required) {
            stati.required = true;
        }

        return stati;
    }

    private calculateEndDate() {
        if (this.startDate && this.duration) {
            this.endDate = new moment(this.startDate).add(this.duration, 'minutes');
        }
    }

    private calculateDuration() {
        // set the seconds to 0
        this.model.getFieldValue(this.fieldend).seconds(0);
        this.model.getFieldValue(this.fieldstart).seconds(0);

        let duration = moment.duration(this.model.getFieldValue(this.fieldend).diff(this.model.getFieldValue(this.fieldstart)));
        let hours = Math.floor(duration.asHours());
        let minutes = duration.asMinutes() - 60 * hours;

        this.model.setField(this.fieldhours, hours);
        this.model.setField(this.fieldminutes, minutes);
    }
}
