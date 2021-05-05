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
    private routeBase = 'admin/crmlog';
    private entriesPerPage = 20;

    // The log data from the backend:
    private entries: any[] = [];
    private entriesToShow: any[] = []; // Same as "entries" if no text filter is applied.

    // Users
    private users: any[];

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

        /*
        // Individual route, because of bug SPICEUI-159.
        this.backend.getRequest( this.routeBase+'/userlist' ).subscribe( response => {
            this.userlist = response.list;
            this.userlist.forEach( ( val, i ) => {
                this.userlistIndexes[val.id] = i;
            });
        });

         */

    }

    public ngOnInit() {
        if ( this.load$ ) this.load$.subscribe( () => this.loadData() );
        else this.loadData();
    }

    // Load the log entries from the backend.
    private loadData() {

        if ( this.isLoading ) return;

        let route = this.routeBase+'/entries';
        this.isLoading = true;
        this.isLoaded = false;
        this.entriesToShow = [];
        this.localFiltertextPositive = '';
        this.localFiltertextNegative = [];

        // Build the REST route query:

        let periodType: string;
        if ( !this.period.begin.year ) periodType = '';
        else if ( !this.period.begin.month ) periodType = 'year';
        else if ( !this.period.begin.day ) periodType = 'month';
        else if ( !this.period.begin.hour ) periodType = 'day';
        else periodType = 'hour';

        let begin, end;

        if ( this.period.type ) {

            begin = moment.tz( this.period.begin.year + '-'
                + (this.period.begin.month ? this.period.begin.month : '01') + '-'
                + (this.period.begin.day ? this.period.begin.day : '01') + ' '
                + (this.period.begin.hour ? this.period.begin.hour : '00')
                + ':00', this.prefs.toUse.timezone );

            end = begin.clone();
            end.add( this.period.duration, this.period.type );

            begin.tz('UTC');
            end.tz('UTC');

            // switched off after route changement on 2021-04-07
            // route += '/' + begin.format( 'YYYYMMDDHH' ) + '/' + end.format( 'YYYYMMDDHH' );

        }

        // Build the query parameters for the request:
        let queryParams = {
            limit: this.limit ? this.limit : undefined,
            level: this.filter.level ? this.filter.level : undefined,
            processId: this.filter.processId ? this.filter.processId : undefined,
            // switched off temporarily with route changement on 2021-04-07:
            userId: this.filter.userId ? this.filter.userId : undefined,
            text: this.filter.text ? this.filter.text : undefined,
            transactionId: this.filter.transactionId ? this.filter.transactionId : undefined,
            // moved parameter "begin" and "end" from path to query (route changement on 2021-04-07):
            begin: this.period.type ? begin.format( 'YYYYMMDDHH' ) : undefined,
            end: this.period.type ? end.format( 'YYYYMMDDHH' ) : undefined
        };
        this.toast.clearToast( this.toastId );
        this.backend.getRequest( route, queryParams ).subscribe(
        response => {
                this.entries = response.entries;
                this.entries.forEach( ( entry, i ) => {
                    entry.date = moment.unix( entry.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getDateFormat() );
                    entry.time = moment.unix( entry.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getTimeFormat() );
                    entry.i = i;
                });
                this.updateLocalFiltering();
                this.users = response.users;
                this.isLoaded = true;
                this.isLoading = false;
            },
            error => {
                this.toast.sendToast('Error loading log data!', 'error' );
                this.isLoading = false;
            }
        );

    }

    // After the angular-rendering we check for every log entry / table row, if the log text is truncated by the browser (because it wouldn´t fit into column) or not.
    // The trick to detect truncation: When scrollWidth > clientWidth.
    public ngAfterViewChecked() {
        let htmlTableRows;
        let numberOfTextColumn = 6;
        let numberOfExpandButtonColumn = 7;
        if ( this.tbody && this.tbody.nativeElement ) {
            htmlTableRows = this.tbody.nativeElement.childNodes;
            if ( htmlTableRows ) {
                // We iterate the tbody, but we skip non tr elements and any dom elements not containing log data (for example: angular comments).
                htmlTableRows.forEach( ( row ) => {
                    if( row.tagName !== 'TR' || row.childNodes.length < 2 ) return;
                    let div = row.childNodes[numberOfTextColumn].childNodes[0];
                    row.childNodes[numberOfExpandButtonColumn].childNodes[0].style.visibility = ( div.scrollWidth === div.clientWidth ? 'hidden':'auto' ); // Show the expand button only when the div is not (yet) truncated.
                });
            }
        }
    }

    // Open the modal window to display a log entry with unusual long log text.
    private showEntryInModal(i) {
        this.modalservice.openModal('CRMLogViewerModal' ).subscribe( modal => {
            modal.instance.entry = this.entriesToShow[i];
            modal.instance.username = this.entriesToShow[i].uname;
            modal.instance.routeBase = this.routeBase;
        });
    }

    // Iterate the entries to build the filtered list.
    private buildEntriesToShow() {
        this.isBuildingLocalTextfilter = true;
        this.entriesToShow = [];
        this.entries.forEach( entry => {
            let localFiltertextPositiveLowercase = this.localFiltertextPositive.toLowerCase();
            if ( entry.txt.toLowerCase().indexOf( localFiltertextPositiveLowercase ) !== -1 && !this.localFiltertextNegative.some( ( term ) => {
                if ( entry.txt.toLowerCase().indexOf( term.lowercase ) !== -1 ) return true;
            })) {
                this.entriesToShow.push( entry );
            }
        });
        this.updateIndexNumbers();
        this.currPage = 1;
        window.setTimeout( () => this.isBuildingLocalTextfilter = false, 750 );
    }

    private updateIndexNumbers() {
        let i = 0;
        this.entriesToShow.forEach( entry => entry.i = i++ );
    }

    private resetEntriesToShow() {
        this.isBuildingLocalTextfilter = true; // Changes opacity of the table (for a moment), to indicate that the table is changed.
        this.entriesToShow = [];
        this.entries.forEach( entry => this.entriesToShow.push( entry ) );
        this.updateIndexNumbers();
        this.currPage = 1;
        window.setTimeout( () => this.isBuildingLocalTextfilter = false, 750 );
    }

    // A filter text has been applied?
    private get isFiltered() {
        return this.entries.length != this.entriesToShow.length;
    }

    // Mark expand property for every log entry. But only neccessary for the page shown at last.
    private collapseEntriesOfPage( pageNr ) {
        for ( let i=(pageNr-1)*this.entriesPerPage; i < pageNr*this.entriesPerPage; i++ ) {
            if( this.entries[i] ) this.entries[i].expand = false;
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
        if (  !this.localFiltertextPositive && !this.localFiltertextNegative.length && this.isFiltered ) this.resetEntriesToShow();
        else if ( this.entries.length) this.buildEntriesToShow();
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
