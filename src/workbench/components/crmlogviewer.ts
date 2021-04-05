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
 * @module WorkbenchModule
 */
import { Component, EventEmitter } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: './src/workbench/templates/crmlogviewer.html',
    styles: [
        'input::placeholder { font-style: italic; color: #666 !important; }'
    ]
})
export class CRMLogViewer {

    // Configuration:
    private levels = [ 'debug', 'info', 'warn', 'deprecated', 'login', 'error', 'fatal', 'security' ];
    private limit = '5000';

    // Various:
    private filter = { level: 'fatal', processId: '', userId: '', text: '', transactionId: '' };
    private period = { type: '', start: { year: '', month: '', day: '', hour: '' }, begin: { year: '', month: '', day: '', hour: '' }, duration: '1' };

    // The hole list of CRM users:
    private userlist: any[];
    private userlistIndexes = {};

    private load$ = new EventEmitter();

    constructor( private lang: language, private backend: backend ) {

        // Individual route, because of bug SPICEUI-159.
        this.backend.getRequest( 'crmlog/userlist' ).subscribe( response => {
            this.userlist = response.list;
            this.userlist.forEach( ( val, i ) => {
                this.userlistIndexes[val.id] = i;
            });
        });

    }

    // Are all the inputs correct and ready for the backend request?
    private canLoad() {
        if ( this.period.begin.year && !this.period.begin.year.match(/^\d{4}$/) ) return false;
        if ( this.filter.processId && !this.filter.processId.match(/\d$/) ) return false;
        if ( this.limit && !this.limit.match(/\d$/) ) return false;
        if ( this.period.begin.hour && !this.period.begin.day ) return false;
        return true;
    }

    // Load button was pressed.
    private buttonLoad() {
        this.load$.emit();
    }

    // Get the number of days for a specific month/year (28, 29, 30 or 31).
    private daysInMonth( month: string, year: string ) {
        return new Date( parseInt( year, 10 ), parseInt( month, 10 ), 0 ).getDate();
    }

    // Get a simple array of day numbers (for ngIf).
    private get daylist() {
        let daysInMonth = ( !this.period.begin.month || !this.period.begin.year ) ? 31 : this.daysInMonth( this.period.begin.month, this.period.begin.year );
        let list = [];
        for ( let i=1; i <= daysInMonth; i++ ) list.push( ( i < 10 ? '0':'' ) + i );
        return list;
    }

    // Check, if the year input field has a valid value.
    private checkYear() {
        return this.period.begin.year.match(/^\d{4}$/);
    }

    private changedYear() {
        if ( !this.period.begin.year ) this.period.begin.month = this.period.begin.day = this.period.begin.hour = '';
        this.setPeriodType();
    }
    private changedHour() {
        if ( this.period.begin.hour ) {
            this.setYearNow();
            this.setMonthNow();
            this.setDayNow();
        }
        this.setPeriodType();
    }
    private changedDay() {
        if ( !this.period.begin.day ) this.period.begin.hour = '';
        else {
            this.setYearNow();
            this.setMonthNow();
        }
        this.setPeriodType();
    }
    private changedMonth() {
        if ( !this.period.begin.month ) this.period.begin.day = this.period.begin.hour = '';
        else {
            if ( this.period.begin.day && parseInt( this.period.begin.day, 10 ) > this.daysInMonth( this.period.begin.month, this.period.begin.year )) this.period.begin.day = '';
            this.setYearNow();
        }
        this.setPeriodType();
    }

    private setYearNow() {
        if ( !this.period.begin.year ) this.period.begin.year = (new Date()).getFullYear().toString();
    }
    private setMonthNow() {
        if ( !this.period.begin.month ) {
            this.period.begin.month = ((new Date()).getMonth()+1).toString();
            if ( this.period.begin.month.length === 1 ) this.period.begin.month = '0'+this.period.begin.month;
        }
    }
    private setDayNow() {
        if( !this.period.begin.day ) {
            this.period.begin.day = (new Date()).getDate().toString();
            if ( this.period.begin.day.length === 1 ) this.period.begin.day = '0'+this.period.begin.day;
        }
    }

    // The values in the list can be clicked to be transfered to the corresponding filter input field.
    private valueClicked( click: any ) {
        let items: string[];
        switch ( click.type ) {
            case 'date':
                items = click.value.split('\.');
                this.period.begin.day = items[0];
                this.period.begin.month = items[1];
                this.period.begin.year = items[2];
                break;
            case 'time':
                items = click.value.split(':');
                this.period.begin.hour = items[0];
                break;
            case 'tid': this.filter.transactionId = click.value; break;
            case 'uid': this.filter.userId = click.value; break;
            case 'lev': this.filter.level = click.value; break;
            case 'pid': this.filter.processId = click.value.toString(); break;
        }
    }

    private sanitizeDuration() {
        if ( !this.period.duration.match( /\d+/ )) this.period.duration = '1';
    }

    private get durationLabel() {
        let labels = {
            'year': 'LBL_YEARS',
            'month': 'LBL_MONTHS',
            'day': 'LBL_DAYS',
            'hour': 'LBL_HOURS'
        };
        return this.period.type ? labels[this.period.type] : '';
    }

    private setPeriodType() {
        this.period.type =
            !this.period.begin.year ?  '' :
                !this.period.begin.month ? 'year' :
                    !this.period.begin.day ? 'month' :
                        !this.period.begin.hour ? 'day' : 'hour';
    }

}
