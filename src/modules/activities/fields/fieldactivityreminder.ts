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
 * @module ModuleActivities
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {userpreferences} from "../../../services/userpreferences.service";

declare var moment;

/**
 * renders a date formatted based on the past period like. If today will display only the hour, if this year will
 * display the month name and the day, and if it is a date in a different year then it displays a full date.
 */
@Component({
    selector: 'field-activity-reminder',
    templateUrl: './src/modules/activities/templates/fieldactivityreminder.html'
})
export class fieldActivityReminder extends fieldGeneric {

    /**
     * the reminder options
     * @private
     */
    private options = [
        {value: '-1', label: 'LBL_REMINDER_NONE'},
        {value: '60', label: 'LBL_REMINDER_1MINUTE'},
        {value: '300', label: 'LBL_REMINDER_5MINUTES'},
        {value: '600', label: 'LBL_REMINDER_10MINUTES'},
        {value: '900', label: 'LBL_REMINDER_15MINUTES'},
        {value: '1800', label: 'LBL_REMINDER_30MINUTES'},
        {value: '3600', label: 'LBL_REMINDER_1HOUR'},
        {value: '7200', label: 'LBL_REMINDER_2HOURS'},
        {value: '10800', label: 'LBL_REMINDER_3HOURS'},
        {value: '18000', label: 'LBL_REMINDER_5HOURS'},
        {value: '86400', label: 'LBL_REMINDER_1DAY'}
    ];

    constructor(public model: model,
                public view: view,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal,
                private userpreferences: userpreferences) {

        super(model, view, language, metadata, router);
    }

    /**
     * returns the display value
     */
    get display(){
        return this.options.find(o => o.value == this.value).label;
    }

    /**
     * a getter for the value bound top the model
     * returns -1 if no value is set / bwd compatibility with legacy data
     */
    get value() {
        let v = this.model.getField(this.fieldname);
        return v ? v : '-1';
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val);
    }

}
