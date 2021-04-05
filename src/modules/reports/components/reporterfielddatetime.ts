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
 * @module ModuleReports
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {session} from '../../../services/session.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";

/** @ignore */
declare var moment: any;

/**
 * display formatted report record value with date time
 */
@Component({
    selector: 'reporter-field-date-time',
    templateUrl: './src/modules/reports/templates/reporterfielddatetime.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterFieldDateTime implements OnInit {
    /**
     * report full record
     */
    private record: any = {};
    /**
     * report field
     */
    private field: any = {};
    /**
     * display value
     */
    private value: string = '';
    /**
     * to save observable for unsubscribe
     */
    private subscription: Subscription = new Subscription();

    constructor(private userpreferences: userpreferences,
                private session: session,
                private cdRef: ChangeDetectorRef,
                private broadcast: broadcast) {
        this.subscribeToTimezoneChange();
    }

    /**
     * call to set the display value
     */
    public ngOnInit() {
        this.setFormattedFieldValue();
    }

    /**
     * unsubscribe from subscription
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * reset the field value on timezone change
     */
    private subscribeToTimezoneChange() {
        this.subscription.add(
            this.broadcast.message$.subscribe(message => {
                if (message.messagetype == 'timezone.changed') {
                    this.setFormattedFieldValue();
                    this.cdRef.detectChanges();
                }
            })
        );
    }

    /**
     * set formatted field value
     */
    private setFormattedFieldValue() {

        if (this.record[this.field.fieldid]) {
            let date = new moment.utc(this.record[this.field.fieldid]).tz(this.session.getSessionData('timezone') || moment.tz.guess(true));
            if (date.isValid()) {
                this.value = this.userpreferences.formatDateTime(date);
            }
        }
    }
}
