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
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, OnInit, AfterViewChecked } from '@angular/core';
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
    selector: 'crm-log-viewer-list',
    templateUrl: './src/workbench/templates/crmlogviewerlist.html',
    styles: [
        'td.expanded { white-space: normal; word-break: break-word; }',
        'td.expanded div { overflow-wrap: break-word; }',
        'td.collapsed > div { position: absolute; top:0; bottom:0; right:0; left:0; padding: calc(0.25rem + 4px) calc(0.5rem + 0px); }',
        'a.notClickable { cursor: text }',
        'a.notClickable:hover { text-decoration: none; }'
    ]
})
export class CRMLogViewerList implements OnInit, AfterViewChecked {

    @Input() private filter = { level: '', processId: '', userId: '', text: '', transactionId: '' };
    @Input() private period = { type: '', begin: { year: '', month: '', day: '', hour: '' }, end: { year: '', month: '', day: '', hour: '' }, duration: '' };
    @Input() private limit = '';
    @Input('load') private load$: EventEmitter<null>;
    @Input() private valuesNotClickable = false;

    @Output('valueClicked') private valueClicked$ = new EventEmitter();

    // Configuration:
    private routeBase = 'crmlog';
    private linesPerPage = 20;

    // The log data from the backend:
    private lines: any[] = [];
    private linesToShow: any[] = []; // Same as lines if no text filter is applied.

    // The hole list of CRM users:
    private userlist: any[];
    private userlistIndexes = {};

    // Various:
    private currPage = 1;
    private localFiltertextPositive = '';
    private localFiltertextNegative: any[] = [];
    private toastId = '';

    // Stati:
    private isLoading = false;
    private isLoaded = false;
    private isBuildingLocalTextfilter = false;

    @ViewChild('tbody', {static: false}) private tbody: ElementRef; // Reference to the tbody dom element of the data table.

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences, private modalservice: modal, private toast: toast ) {

        // Individual route, because of bug SPICEUI-159.
        this.backend.getRequest( 'krestlog/userlist' ).subscribe( response => {
            this.userlist = response.list;
            this.userlist.forEach( ( val, i ) => {
                this.userlistIndexes[val.id] = i;
            });
        });

    }

    public ngOnInit() {
        if ( this.load$ ) this.load$.subscribe( () => this.loadData() );
        else this.loadData();
    }

    // Get the name for a specific user.
    private getUsername( userId ) {
        if ( !userId || !this.userlistIndexes.hasOwnProperty( userId )) return userId;
        return this.userlist[this.userlistIndexes[userId]].name;
    }

    // Load the log lines from the backend.
    private loadData() {

        if ( this.isLoading ) return;

        let route = this.routeBase;
        this.isLoading = true;
        this.isLoaded = false;
        this.linesToShow = [];
        this.localFiltertextPositive = '';
        this.localFiltertextNegative = [];

        // Build the REST route:

        let periodType: string;
        if ( !this.period.begin.year ) periodType = '';
        else if ( !this.period.begin.month ) periodType = 'year';
        else if ( !this.period.begin.day ) periodType = 'month';
        else if ( !this.period.begin.hour ) periodType = 'day';
        else periodType = 'hour';

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
            limit: this.limit ? this.limit : undefined,
            level: this.filter.level ? this.filter.level : undefined,
            processId: this.filter.processId ? this.filter.processId : undefined,
            userId: this.filter.userId ? this.filter.userId : undefined,
            text: this.filter.text ? this.filter.text : undefined,
            transactionId: this.filter.transactionId ? this.filter.transactionId : undefined,
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
                this.updateLocalFiltering();
                this.isLoaded = true;
                this.isLoading = false;
                // The backend has to use "SpiceLogger" instead of "SugarLogger", because only SpiceLogger logs to the database. Warning in case of wrong configuration in config.php.
                if ( !response.SpiceLogger ) this.toastId = this.toast.sendToast('SpiceLogger not used for logging!', 'warning', 'The CRM Log Viewer needs logging by „SpiceLogger“. Define it´s usage in config.php.', false );
            },
            error => {
                this.toast.sendToast('Error loading log data!', 'error' );
                this.isLoading = false;
            }
        );

    }

    // After the angular-rendering we check for every line / table row, if the log text is truncated by the browser (because it wouldn´t fit into column) or not.
    // The trick to detect truncation: When scrollWidth > clientWidth.
    public ngAfterViewChecked() {
        let htmlTableRows;
        if ( this.tbody && this.tbody.nativeElement ) {
            htmlTableRows = this.tbody.nativeElement.childNodes;
            if ( htmlTableRows ) {
                // We iterate the tbody, but we skip non tr elements and any dom elements not containing log data (for example: angular comments).
                htmlTableRows.forEach( ( row ) => {
                    if( row.tagName !== 'TR' || row.childNodes.length < 2 ) return;
                    let div = row.childNodes[6].childNodes[0];
                    row.childNodes[7].childNodes[0].style.visibility = ( div.scrollWidth === div.clientWidth ? 'hidden':'auto' ); // Show the expand button only when the div is not (yet) truncated.
                });
            }
        }
    }

    // Open the modal window to display a log line with unusual long log text.
    private showLineInModal(i) {
        this.modalservice.openModal('CRMLogViewerModal' ).subscribe( modal => {
            modal.instance.line = this.linesToShow[i];
            modal.instance.username = this.getUsername( this.linesToShow[i].uid );
            modal.instance.routeBase = this.routeBase;
        });
    }

    // Iterate the lines to build the filtered list.
    private buildLinesToShow() {
        this.isBuildingLocalTextfilter = true;
        this.linesToShow = [];
        this.lines.forEach( line => {
            let localFiltertextPositiveLowercase = this.localFiltertextPositive.toLowerCase();
            if ( line.txt.toLowerCase().indexOf( localFiltertextPositiveLowercase ) !== -1 && !this.localFiltertextNegative.some( ( term ) => {
                if ( line.txt.toLowerCase().indexOf( term.lowercase ) !== -1 ) return true;
            })) {
                this.linesToShow.push( line );
            }
        });
        this.updateIndexNumbers();
        this.currPage = 1;
        window.setTimeout( () => this.isBuildingLocalTextfilter = false, 750 );
    }

    private updateIndexNumbers() {
        let i = 0;
        this.linesToShow.forEach( line => line.i = i++ );
    }

    private resetLinesToShow() {
        this.isBuildingLocalTextfilter = true; // Changes opacity of the table (for a moment), to indicate that the table is changed.
        this.linesToShow = [];
        this.lines.forEach( line => this.linesToShow.push( line ) );
        this.updateIndexNumbers();
        this.currPage = 1;
        window.setTimeout( () => this.isBuildingLocalTextfilter = false, 750 );
    }

    // A filter text has been applied?
    private get isFiltered() {
        return this.lines.length != this.linesToShow.length;
    }

    // Mark expand property for every line. But only neccessary for the page shown at last.
    private collapseLinesOfPage( pageNr ) {
        for ( let i=(pageNr-1)*this.linesPerPage; i < pageNr*this.linesPerPage; i++ ) {
            if( this.lines[i] ) this.lines[i].expand = false;
        }
    }

    // Remove positive filter.
    private clearLocalTextFilterPositive() {
        this.localFiltertextPositive = '';
        this.updateLocalFiltering();
    }

    // Remove negative filter.
    private clearLocalTextFilterNegative() {
        this.localFiltertextNegative = [];
        this.updateLocalFiltering();
    }

    private updateLocalFiltering() {
        if (  !this.localFiltertextPositive && !this.localFiltertextNegative.length && this.isFiltered ) this.resetLinesToShow();
        else if ( this.lines.length) this.buildLinesToShow();
    }

    private filterSelectedText() {
        let text = '';
        if ( window.getSelection ) text = window.getSelection().toString();
        text = text.trim();
        if ( text ) {
            this.localFiltertextNegative.push( { original: text, lowercase: text.toLowerCase() } );
            this.updateLocalFiltering();
        }
    }

}
