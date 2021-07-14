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
     * subscribe to the model data$ changes to have an accurate and up to date duration
     */
    public ngOnInit() {
        super.ngOnInit();

        this.subscriptions.add(
            this.model.data$.subscribe((data) => {
                if (this.value && this.dateEnd) {
                    this.duration = moment.duration(this.dateEnd.diff(this.value));
                }
            })
        );
    }

    get fieldend() {
        return this.fieldconfig.field_end ? this.fieldconfig.field_end : 'date_end';
    }

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return this.model.getField(this.fieldname);
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        // build the fields object
        let fields: any = {};
        fields[this.fieldname] = val;

        if (this.duration) {
            // calculate the new end date
            let newEndDate = new moment(val).add(this.duration.asSeconds(), 's');

            // add the end date
            fields[this.fieldend] = newEndDate;
        }

        // set the fields on the model
        this.model.setFields(fields);
    }

    /**
     * getter for the end date
     */
    get dateEnd() {
        return this.model.getField(this.fieldend);
    }

    /**
     * returns the hours from teh duration object
     */
    get currentHours() {
        if(!this.duration) return 0;
        return this.duration.get('hours');
    }

    /**
     * returns the minuts from the duration object
     */
    get currentMinutes() {
        if(!this.duration) return 0;
        return this.duration.get('minutes');
    }

    /**
     * returns the number of hours from the duration
     */
    get editDurationHours() {
        return this.currentHours; // this.model.data[this.fieldhours];
    }

    /**
     * sets the new hours and calcuates the new end date
     *
     * @param hours
     */
    set editDurationHours(hours) {
        let cMinutes = this.currentMinutes;
        let end = new moment(this.value);
        end.add(hours, 'h').add(cMinutes, 'm');
        this.model.setField(this.fieldend, end);
    }

    /**
     * getter for teh duration minutes
     */
    get editDurationMinutes() {
        return this.currentMinutes; // this.model.data[this.fieldminutes];
    }

    /**
     * setter for the durtion minutes
     *
     * @param minutes
     */
    set editDurationMinutes(minutes) {
        let cHours = this.currentHours;
        let end = new moment(this.value);
        end.add(cHours, 'h').add(minutes, 'm');
        this.model.setField(this.fieldend, end);
    }

}
