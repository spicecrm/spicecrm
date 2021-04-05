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
import { Component, ViewChild, ElementRef } from '@angular/core';
import { backend } from '../../services/backend.service';
import { metadata } from '../../services/metadata.service';
import { language } from '../../services/language.service';
import { userpreferences } from '../../services/userpreferences.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: './src/workbench/templates/krestlogviewer.html',
    styles: [
        'td.expanded { white-space: normal; word-break: break-word; }',
        'td.expanded div { overflow-wrap: break-word; }',
        'td.collapsed > div { position: absolute; top:0; bottom:0; right:0; left:0; padding: calc(0.25rem + 4px) calc(0.5rem + 0px); }',
        'input::placeholder { font-style: italic; color: #666 !important; }',
        'tr.notStatus200 td, tr.notStatus200 td a { color: #d00; }',
        'tr.notStatus200 td.status { font-weight: bold !important; }'
    ]
})
export class KRESTLogViewer {

    // Configuration:
    private routeBase = 'krestlog';
    private methods = [ 'CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'PUT', 'TRACE' ];
    private limit = '5000';
    private linesPerPage = 20;

    // The log data from the backend:
    private lines: any[] = [];

    // The hole list of CRM users:
    private userlist: any[];
    private userlistIndexes = {};

    // The hole list of routes:
    private routes: any[];
    private routesIndexes = {};

    // Various:
    private currPage = 1;
    private filter = { method: 'POST', sessionId: '', userId: '', urlParams: '', postParams: '', routeArgs: '', ipAddress: '', url: '', route: '', status: '', transactionId: '' };
    private period = { type: '', begin: { year: '', month: '', day: '', hour: '' }, end: { year: '', month: '', day: '', hour: '' }, duration: '1' };
    private filtertext = '';
    private yearNow: string;
    private toastId = '';
    private modal: any;
    private lineNrInModal: number;

    // Stati:
    private isLoading = false;
    private isLoaded = false;

    @ViewChild('tbody', {static: true}) private tbody: ElementRef; // Reference to the tbody dom element of the data table.

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences, private modalservice: modal, private toast: toast ) {

        // Individual route, because of bug SPICEUI-159.
        this.backend.getRequest( 'krestlog/userlist' ).subscribe( response => {
            this.userlist = response.list;
            this.userlist.forEach( ( val, i ) => {
                this.userlistIndexes[val.id] = i;
            });
        });

        this.yearNow = (new Date()).getFullYear().toString();
        this.backend.getRequest( 'krestlog/routes' ).subscribe( response => {
            this.routes = response.routes;
            this.routes.forEach( ( val, i ) => {
                this.routesIndexes[val.id] = i;
            });
        });
   }

    // Get the name for a specific user.
    private getUsername( userId ) {
        if ( !userId || !this.userlistIndexes.hasOwnProperty( userId )) return userId;
        return this.userlist[this.userlistIndexes[userId]].name;
    }

    // Load the log lines from the backend.
    private loadData() {

        if ( !this.canLoad()) return; // Check if all input fields (filter and limit) are valid and we can load.

        let route = this.routeBase;
        this.isLoading = true;
        this.isLoaded = false;
        this.filtertext = '';

        // Build the REST route:

        if ( this.period.type ) {

            let begin = moment.tz( this.period.begin.year + '-'
                + (this.period.begin.month ? this.period.begin.month : '01') + '-'
                + (this.period.begin.day ? this.period.begin.day : '01') + ' '
                + (this.period.begin.hour ? this.period.begin.hour : '00')
                + ':00', this.prefs.toUse.timezone );

            let end = begin.clone();
            end.add( this.period.duration, this.period.type );

            begin.tz('UTC');
            end.tz('UTC');

            route += '/' + begin.format( 'YYYYMMDDHH' ) + '/' + end.format( 'YYYYMMDDHH' );

        }

        // Build the query parameters for the request:
        let queryParams = {
            limit: this.limit.length ? this.limit : undefined,
            method: this.filter.method.length ? this.filter.method : undefined,
            route: this.filter.route.length ? this.filter.route : undefined,
            theUrl: this.filter.url.length ? this.filter.url : undefined, // "theUrl" because "url" doesn't work. proxy?
            userId: this.filter.userId.length ? this.filter.userId : undefined,
            routeArgs: this.filter.routeArgs.length ? this.filter.routeArgs : undefined,
            postParams: this.filter.postParams.length ? this.filter.postParams : undefined,
            urlParams: this.filter.urlParams.length ? this.filter.urlParams : undefined,
            ipAddress: this.filter.ipAddress.length ? this.filter.ipAddress : undefined,
            status: this.filter.status.length ? this.filter.status : undefined,
            transactionId: this.filter.transactionId.length ? this.filter.transactionId : undefined,
        };
        this.toast.clearToast( this.toastId );
        this.backend.getRequest( route, queryParams ).subscribe(
        response => {
                this.lines = response.lines;
                this.lines.forEach( ( line, i ) => {
                    line.date = moment.unix( line.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getDateFormat() );
                    line.time = moment.unix( line.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getTimeFormat() );
                    line.i = i;
                });
                this.currPage = 1;
                this.isLoaded = true;
                this.isLoading = false;
            },
            error => {
                this.toast.sendToast('Error loading log data!', 'error' );
                this.isLoading = false;
            }
        );

    }

    // Are all the inputs correct and ready for the backend request?
    private canLoad() {
        if ( this.isLoading ) return false;
        if ( this.period.begin.year && !this.period.begin.year.match(/^\d{4}$/) ) return false;
        if ( this.limit && !this.limit.match(/\d$/) ) return false;
        if ( this.period.begin.hour && !this.period.begin.day ) return false;
        return true;
    }

    // Load button was pressed.
    private buttonLoad() {
        this.loadData();
    }

    // Get the number of days for a specific month/year (28, 29, 30 or 31).
    private daysInMonth( month: string, year: string ) {
        return new Date( parseInt( year, 10 ), parseInt( month, 10 ), 0 ).getDate();
    }

    // Get a simple array of day numbers (for ngFor).
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

    // Open the modal window to display a log line with unusual long log text.
    private showLineInModal( lineNr ) {
        if ( !this.modal || this.modal.instance.isClosed ) {
            this.modalservice.openModal( 'KRESTLogViewerModal' ).subscribe( modal => {
                this.modal = modal;
                this.modal.instance.routeBase = this.routeBase;
                this.modal.instance.nrOfLines = this.lines.length;
                this.handOverModalData( lineNr );
                this.lineNrInModal = lineNr;
                modal.instance.toLeft$.subscribe( () => {
                    if ( this.lineNrInModal > 0 ) this.showLineInModal( --this.lineNrInModal );
                });
                modal.instance.toRight$.subscribe( () => {
                    if ( this.lineNrInModal < this.lines.length-1 ) this.showLineInModal( ++this.lineNrInModal );
                });
            } );
        } else {
            this.handOverModalData( lineNr );
        }
    }

    // Open the modal window to display a log line with unusual long log text.
    private showCRMlog( transactionId: string ) {
        this.modalservice.openModal( 'CRMLogViewerListModal' ).subscribe( modal => {
            modal.instance.filter = { transactionId: transactionId };
        } );
    }

    private handOverModalData( lineNr ) {
        this.currPage = Math.ceil( (lineNr+1) / 20 );
        this.modal.instance.lineNr = lineNr;
        this.modal.instance.line = this.lines[lineNr];
        this.modal.instance.username = this.getUsername( this.lines[lineNr].uid );
        this.modal.instance.load();
    }

    // Mark expand property for every line. But only neccessary for the page shown at last.
    private collapseLinesOfPage( pageNr ) {
        for ( let i=(pageNr-1)*this.linesPerPage; i < pageNr*this.linesPerPage; i++ ) {
            if( this.lines[i] ) this.lines[i].expand = false;
        }
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
    private valueClicked( type: string, value: string ) {
        let items: string[];
        switch ( type ) {
            case 'date':
                items = value.split('\.');
                this.period.begin.day = items[0];
                this.period.begin.month = items[1];
                this.period.begin.year = items[2];
                break;
            case 'time':
                items = value.split(':');
                this.period.begin.hour = items[0];
                break;
            case 'tid': this.filter.transactionId = value; break;
            case 'uid': this.filter.userId = value; break;
            case 'route': this.filter.route = value; break;
            case 'method': this.filter.method = value; break;
            case 'status': this.filter.status = value; break;
        }
    }

    private sanitizeDuration() {
        if ( !this.period.duration.match( /\d+/ )) this.period.duration = '1';
    }

    private get durationLabel() {
        let labels = { year: 'LBL_YEARS', month: 'LBL_MONTHS', day: 'LBL_DAYS', hour: 'LBL_HOURS' };
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
