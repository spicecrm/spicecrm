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
 * @module SystemComponents
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges, OnDestroy,
    SimpleChanges
} from '@angular/core';

import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {session} from '../../services/session.service';
import {Subscription} from "rxjs";

declare var moment: any;

/**
 * displays a date and/or time in the format of the user
 */
@Component({
    selector: 'system-display-datetime',
    templateUrl: './src/systemcomponents/templates/systemdisplaydatetime.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemDisplayDatetime implements AfterViewInit, OnChanges, OnDestroy {

    /**
     * the number to be displayed
     */
    @Input() private date: any;

    /**
     * set to true to not display the date
     *
     * @private
     */
    @Input() private displayDate: boolean = true;

    /**
     * set to false to not return the time value
     *
     * @private
     */
    @Input() private displayTime: boolean = true;

    /**
     * holds the components subscriptions
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private language: language, private cdRef: ChangeDetectorRef, private session: session, private userpreferences: userpreferences) {

    }

    /**
     * on changes also trigger the change detection
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.detectChanges();
    }

    /**
     * cancel any active subscriptiuon we might have
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * after view init subscribe to changes and we can also run detect changes if changes happen
     */
    public ngAfterViewInit() {
        this.subscribeToPrefs();
    }

    /*
    * subscribe to pref changes
     */
    private subscribeToPrefs() {
        this.subscriptions.add(
            this.userpreferences.preferences$.subscribe(prefs => {
                this.prefChanges(prefs);
            })
        );
    }

    /**
     * handle pref changes and detect changes
     *
     * @param prefs
     * @private
     */
    private prefChanges(prefs) {
        this.detectChanges();
    }

    /**
     * triggers the change detection when the language is changed
     */
    private detectChanges() {
        this.cdRef.detectChanges();
    }

    /**
     * returns the value to be displayed
     */
    get displayValue() {
        // if we do not have a date or neither date nor time should be displayed return empty
        if (!this.date || (!this.displayDate && !this.displayTime)) return '';

        let formatArray = [];
        if (this.displayDate) formatArray.push(this.userpreferences.getDateFormat());
        if (this.displayTime) formatArray.push(this.userpreferences.getTimeFormat());

        if(moment.isMoment(this.date)) {
            return this.date.format(formatArray.join(' '));
        } else {
            let timeZone = this.session.getSessionData('timezone') || moment.tz.guess(true);
            // set the Time Zone for the Field Value only if the Time Zone is set
            return moment.utc(this.date).tz(timeZone).format(formatArray.join(' '));
        }
    }

}
