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
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";
import {session} from "../../services/session.service";
import {timeline} from "../../services/timeline.service";

declare var moment;

@Component({
    selector: 'object-timeline-item-created',
    templateUrl: '../templates/objecttimelineitemcreated.html',
    styles: ['.objecttimeline-item { width: calc(100% - 86px); border: 1px solid var(--color-grey-5); background-color: var(--color-white); box-shadow: 0 2px 3px 0 rgb(0 0 16%); border-radius: 0.25rem }',
        '.objecttimeline-item-nubbin-right { height:  20px;width: 20px; margin-right: -10px; background-color: var(--color-white); transform: rotate(45deg); border-bottom: 1px solid var(--color-grey-5); border-left: 1px solid var(--color-grey-5)}',
        '.objecttimeline-item-nubbin-left { height:  20px;width: 20px; margin-left: -10px; background-color: var(--color-white); transform: rotate(-135deg); border-bottom: 1px solid var(--color-grey-5); border-left: 1px solid var(--color-grey-5)}'],

})
export class ObjectTimelineItemCreated {

    @Input() public record;

    /**
     * left = true; right = false
     */
    @Input() public side;

    public nubbin: object;

    public itemside: object;

    public date = '';

    constructor(public timeline: timeline, public model: model, public language: language, public metadata: metadata, public userpreferences: userpreferences, public session: session) {
    }

    get user_name() {
        let user = this.record.user_name;
        return user.charAt(0).toUpperCase() + user.substring(1);
    }

    get module() {
        return this.model.module.slice(0, -1);
    }

    get recordDate() {

        const date = new moment.utc(this.record.date_entered).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));

        const isToday = date.format('YYYYMMDD') == new moment().format('YYYYMMDD');
        const isThisYear = date.format('YYYY') == new moment().format('YYYY');

        if (isToday) {
            return date.format(this.userpreferences.getTimeFormat());
        } else if (isThisYear) {
            return date.format('MMM D');
        } else {
            return date.format(this.userpreferences.getDateFormat());
        }
    }

    public ngOnInit() {
        if (!this.side) {
            this.itemside = {'slds-m-left--xx-small': true};
        } else {
            this.itemside = {'slds-m-right--xx-small': true, 'slds-grid--align-end': true};
        }
    }

}
