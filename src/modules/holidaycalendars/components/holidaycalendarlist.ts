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
 * @module ModuleHolidayCalendars
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {modellist} from "../../../services/modellist.service";

@Component({
    templateUrl: './src/modules/holidaycalendars/templates/holidaycalendarlist.html',
    providers: [modellist, model]
})
export class HolidayCalendarList implements OnInit {

    /**
     * the active calendar id
     * @private
     */
    private _activeCalendarID: string;

    /**
     * the actionset
     * @private
     */
    private actionset: string;

    constructor(
        private language: language,
        private modellist: modellist,
        private model: model,
        private metadata: metadata,
    ) {
        let componentconfig = this.metadata.getComponentConfig('HolidayCalendarList', 'SystemHolidayCalendars');
        this.actionset = componentconfig.actionset;
    }

    public ngOnInit() {
        this.modellist.module = 'SystemHolidayCalendars';
    }

    /**
     * reloads the calendar list
     * @private
     */
    private refresh() {
        this.activeCalendar = undefined;
        this.modellist.reLoadList();
    }

    /**
     * sets the active calendar ID
     * @param id
     */
    set activeCalendar(id) {
        this._activeCalendarID = id;
    }

    /**
     * gets the active calendar ID
     */
    get activeCalendar() {
        return this._activeCalendarID;
    }

    /**
     * adds a new calendar
     * @private
     */
    private addCalendar() {
        this.model.module = 'SystemHolidayCalendars';
        this.model.initialize();
        this.model.addModel();
    }

    /**
     * adds a new calendar
     * @private
     */
    private addDay() {
        this.model.module = 'SystemHolidayCalendarDays';
        this.model.initialize();
        this.model.addModel(null,null, {systemholidaycalendar_id: this.activeCalendar});
    }

}
