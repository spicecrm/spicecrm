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
import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';

import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";
import {modal} from "../../services/modal.service";
import {auditRecord, timeline} from "../../services/timeline.service";

declare var moment;


@Component({
    selector: 'object-timeline-item-audit',
    templateUrl: '../templates/objecttimelineitemaudit.html',
    styles: ['.objecttimeline-item { width: calc(100% - 86px); border: 1px solid var(--color-grey-5); background-color: var(--color-white); box-shadow: 0 2px 3px 0 rgb(0 0 16%); border-radius: 0.25rem }',
        '.objecttimeline-item-nubbin-right { height:  20px; width: 20px; margin-right: -10px; background-color: var(--color-white); transform: rotate(45deg); border-bottom: 1px solid var(--color-grey-5); border-left: 1px solid var(--color-grey-5)}',
        '.objecttimeline-item-nubbin-left { height:  20px; width: 20px; margin-left: -10px; background-color: var(--color-white); transform: rotate(-135deg); border-bottom: 1px solid var(--color-grey-5); border-left: 1px solid var(--color-grey-5)}'],

})
export class ObjectTimelineItemAudit implements OnInit {

    /**
     * gets the record
     */
    @Input() public record: auditRecord;

    /**
     * left = true; right = false
     */
    @Input() public side: boolean;

    /**
     * ngClass object to change the nubbin side
     */
    public nubbin: object;

    public auditCount: number;

    /**
     * ngClass object for item side adjustments
     */
    public itemside: object;

    /**
     * holds the date of the record
     */
    public date = '';

    constructor(public timeline: timeline, public model: model, public language: language, public metadata: metadata,
                public userpreferences: userpreferences, public modal: modal, public ViewContainerRef: ViewContainerRef) {
    }

    get fieldCount() {
        return (this.auditCount > 1) ? this.auditCount + ' changes' : this.auditCount + ' change';
    }

    get user_name() {
        let user = this.record.user_name;
        return user.charAt(0).toUpperCase() + user.substring(1);
    }

    /**
     * creates the description of the record
     */
    get description() {
        let description = '';
        for (let record of this.record.data) {
            description += (this.record.data.length > 1) ? this.language.getFieldDisplayName(this.model.module,
                record.field_name) + ', ' : this.language.getFieldDisplayName(this.model.module,
                record.field_name);
        }
        return description;
    }

    get module() {
        return this.model.module.slice(0, -1);
    }

    public ngOnInit() {
        if (!this.side) {
            this.itemside = {'slds-m-left--xx-small': true};
        } else {
            this.itemside = {'slds-m-right--xx-small': true, 'slds-grid--align-end': true};
        }

        this.calculateDate();
        this.auditCount = this.record.data.length;
    }

    public openModal() {
        this.modal.openModal('ObjectTimelineAuditlogModal', true, this.ViewContainerRef.injector).subscribe(modalRef => {
            modalRef.instance.auditLog = this.record;
        });
    }

    public calculateDate() {
        const date = moment.utc(this.record.date);

        const isToday = moment.utc(date.format('YYYY M D')).isSame(new moment().format('YYYY M D'));
        const isThisYear = date.isSame(new moment(), 'year');

        if (isToday) {
            this.date = date.format(this.userpreferences.getTimeFormat());
        } else if (isThisYear) {
            this.date = date.format('MMM D');
        } else {
            this.date = date.format(this.userpreferences.getDateFormat());
        }
    }
}

