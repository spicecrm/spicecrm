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
    selector: 'field-activity-date',
    templateUrl: './src/modules/activities/templates/fieldactivitydate.html'
})
export class fieldActivityDate extends fieldGeneric {
    /**
     * holds a cached object of the date value in raw and formatted
     */
    public cachedValue: { raw: string, formatted?: string };

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
        this.subscribeToDataChange();
    }

    /**
     * call the init method on parent and call to set the formatted value
     */
    public ngOnInit() {
        super.ngOnInit();
        this.setFormattedValue();
    }

    /**
     * subscribe to data changes to reset the formatted value
     * @private
     */
    private subscribeToDataChange() {
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                if (!data[this.fieldname] || moment(this.cachedValue?.raw).isSame(data[this.fieldname])) return;
                this.setFormattedValue();
            })
        );
    }

    /**
     * set the local formatted value
     * @private
     */
    private setFormattedValue() {

        if (!this.value) return;

        this.cachedValue = {raw: this.value};
        const date = new moment(this.value);

        const isToday = moment(date.format('YYYY M D')).isSame(new moment().format('YYYY M D'));
        const isThisYear = date.isSame(new moment(), 'year');

        if (isToday) {
            this.cachedValue.formatted = date.format(this.userpreferences.getTimeFormat());
        } else if (isThisYear) {
            this.cachedValue.formatted = date.format('MMM D');
        } else {
            this.cachedValue.formatted = date.format(this.userpreferences.getDateFormat());
        }
    }
}
