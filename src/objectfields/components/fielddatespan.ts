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
    selector: 'field-date-span',
    templateUrl: './src/objectfields/templates/fielddatespan.html'
})
export class fieldDateSpan extends fieldGeneric implements OnInit {

    /**
     * inidcates that we have a valid field
     *
     * @private
     */
    private isValid: boolean = true;

    /**
     * collected error messages
     *
     * @private
     */
    private errorMessage: string = '';

    /**
     * the duration, held intrnally so we can move the end date when the start date moves
     *
     * @private
     */
    private duration: any;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    /**
     * initialize and subscribe to the model data changes so we can calculate a duration if we have one
     */
    public ngOnInit() {
        super.ngOnInit();

        this.subscriptions.add(
            this.model.data$.subscribe((data) => {
                if (this.startDate && this.endDate) {
                    this.duration = moment.duration(this.endDate.diff(this.startDate));
                }
            })
        );
    }

    get fieldstart() {
        return this.fieldconfig.date_start ? this.fieldconfig.date_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.date_end ? this.fieldconfig.date_end : 'date_end';
    }

    get startDate() {
        return this.model.getField(this.fieldstart);
    }

    set startDate(date) {
        // build the fields object
        let fields: any = {};
        fields[this.fieldstart] = date;

        if (this.duration) {
            // calculate the new end date
            let newEndDate = new moment(date).add(this.duration.asSeconds(), 's');

            // add the end date
            fields[this.fieldend] = newEndDate;
        }

        // set the fields on the model
        this.model.setFields(fields);
    }

    get endDate() {
        return this.model.getField(this.fieldend);
    }

    set endDate(date) {
        // if startdate is not set .. set it ...
        if (!this.model.getFieldValue(this.fieldstart)) {
            this.startDate = new moment(date);
        }

        if (date.isBefore(this.model.getFieldValue(this.fieldstart))) {
            this.isValid = false;
            this.errorMessage = 'enddate cannot be before startdate';
            this.model.setFieldMessage('error', 'enddate cannot be before startdate', this.fieldname, 'sequencecheck');
            // this.calculateEndDate();
        } else {
            this.model.resetFieldMessages(this.fieldname, 'error', 'sequencecheck');
            this.model.setField(this.fieldend, date);
            this.isValid = true;
        }
    }

}
