/**
 * @module WorkbenchModule
 */
import {
    Component,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    OnInit,
    AfterViewChecked,
    ApplicationRef, ChangeDetectorRef
} from '@angular/core';
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
        'td.expanded div { overflow-wrap: break-word; line-height: unset; }',
        'td.collapsed > div { position: absolute; top:0; bottom:0; right:0; left:0; padding: calc(0.25rem + 4px) calc(0.5rem + 0px); line-height: 1.17; }',
        ':host { display: block; height: 100%; }'
    ]
})
export class CRMLogViewerList implements OnInit, AfterViewChecked {

    @Input() private filter = { level: '', processId: '', userId: '', text: '', transactionId: '', start: undefined, end: undefined };
    @Input() private period = { type: '', begin: { year: '', month: '', day: '', hour: '' }, end: { year: '', month: '', day: '', hour: '' }, duration: '' };
    @Input('load') private load$: EventEmitter<null>;
    @Input() private valuesNotClickable = false;

    private countTotalEntries: number;

    @Output('valueClicked') private valueClicked$ = new EventEmitter();

    // Configuration:
    private routeBase = 'admin/crmlog';
    private entriesPerPage = 20;

    // The log data from the backend:
    private entries: any[] = [];
    // private entriesToShow: any[] = []; // Same as "entries" if no text filter is applied.

    // Various:
    private currPage = 1;
    private localFiltertextPositive = '';
    private localFiltertextNegative: any[] = [];
    private toastId = '';
    private queryParams: any;

    // Stati:
    private isLoading = false;
    private isLoaded = false;
    // private isBuildingLocalTextfilter = false;
    private isInitialLoaded = false;

    @ViewChild('tbody', {static: true}) private tbody: ElementRef; // Reference to the tbody dom element of the data table.
    @ViewChild('measurementRowHeight', {static: false}) private measurementRowHeight: ElementRef; // Reference to a tr dom element to measure the hight of a table row.
    @ViewChild('content', {static: false}) private content: ElementRef; // Reference to the tbody dom element of the data table.
    @ViewChild('measurementAvailableSpace', {static: false}) private measurementAvailableSpace: ElementRef; // Reference to a div element to measure the available space.

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences, private modalservice: modal, private toast: toast, private changeDetector: ChangeDetectorRef ) { }

    public ngOnInit() {
        if ( this.load$ ) {
            this.load$.subscribe( () => {
                this.loadData( true );
                this.currPage = 1;
            });
        } else this.loadData( true );
    }

    private setCurrPage( value = 1 ) {
        if ( value !== this.currPage ) {
            this.currPage = this.queryParams.page = value;
            this.loadData();
        }
    }

    private calcEntriesPerPage() {
        this.changeDetector.detectChanges();
        if ( this.measurementRowHeight ) {
            let rowHeight = this.measurementRowHeight.nativeElement.clientHeight - 1;
            let availableSpace = this.measurementAvailableSpace.nativeElement.clientHeight;
            this.entriesPerPage = Math.floor( availableSpace / ( rowHeight + 1 ))+1;
        }
    }

    // Load the log entries from the backend.
    private loadData( newQueryParams = false ) {

        if ( !this.canLoad()) return;

        let route = this.routeBase+'/entries';

        this.isLoaded = false;
        // this.entriesToShow = [];
        this.localFiltertextPositive = '';
        this.localFiltertextNegative = [];

        /*
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
        */

        this.calcEntriesPerPage();

        this.isLoading = true;

        // Build the query parameters for the request:
        if ( newQueryParams ) {
            this.queryParams = {
                level: this.filter.level ? this.filter.level : undefined,
                processId: this.filter.processId ? this.filter.processId : undefined,
                userId: this.filter.userId ? this.filter.userId : undefined,
                text: this.filter.text ? this.filter.text : undefined,
                transactionId: this.filter.transactionId ? this.filter.transactionId : undefined,
                begin: this.filter.start ? this.filter.start.utc().format( 'YYYY-MM-DD HH:mm:ss' ) : undefined,
                end: this.filter.end ? this.filter.end.utc().format( 'YYYY-MM-DD HH:mm:ss' ) : undefined,
                page: this.currPage,
                entriesPerPage: this.entriesPerPage
            };
        }

        this.toast.clearToast( this.toastId );
        this.backend.getRequest( route, this.queryParams ).subscribe(
            response => {
                this.entries = response.entries;
                this.entries.forEach( ( entry, i ) => {
                    entry.datetime = moment.unix( entry.dtx ).tz( this.prefs.toUse.timezone );
                    entry.i = i;
                });
                this.countTotalEntries = response.totalCount;
                this.isLoading = false;
                this.isInitialLoaded = true;
                if( !this.entries.length ) this.currPage = 0;
                // this.updateLocalFiltering();
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
        return true;
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
            // modal.instance.entry = this.entriesToShow[i];
            // modal.instance.username = this.entriesToShow[i].uname;
            modal.instance.entry = this.entries[i];
            modal.instance.username = this.entries[i].uname;
            modal.instance.routeBase = this.routeBase;
        });
    }

    /*
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
     */

    /*
    private updateIndexNumbers() {
        let i = 0;
        this.entriesToShow.forEach( entry => entry.i = i++ );
    }
     */

    /*
    private resetEntriesToShow() {
        this.isBuildingLocalTextfilter = true; // Changes opacity of the table (for a moment), to indicate that the table is changed.
        this.entriesToShow = [];
        this.entries.forEach( entry => this.entriesToShow.push( entry ) );
        this.updateIndexNumbers();
        this.currPage = 1;
        window.setTimeout( () => this.isBuildingLocalTextfilter = false, 750 );
    }
     */

    /*
    // A filter text has been applied?
    private get isFiltered() {
        return this.entries.length != this.entriesToShow.length;
    }
     */

    // Mark expand property for every log entry. But only neccessary for the page shown at last.
    private collapseEntriesOfPage( pageNr ) {
        for ( let i=(pageNr-1)*this.entriesPerPage; i < pageNr*this.entriesPerPage; i++ ) {
            if( this.entries[i] ) this.entries[i].expand = false;
        }
    }

    /*
    // Remove positive filter.
    private clearLocalTextFilterPositive() {
        this.localFiltertextPositive = '';
        this.updateLocalFiltering();
    }
     */

    /*
    // Remove negative filter.
    private clearLocalTextFilterNegative() {
        this.localFiltertextNegative = [];
        this.updateLocalFiltering();
    }
     */

    /*
    private updateLocalFiltering() {
        if (  !this.localFiltertextPositive && !this.localFiltertextNegative.length && this.isFiltered ) this.resetEntriesToShow();
        else if ( this.entries.length) this.buildEntriesToShow();
    }
     */

    /*
    private filterSelectedText() {
        let text = '';
        if ( window.getSelection ) text = window.getSelection().toString();
        text = text.trim();
        if ( text ) {
            this.localFiltertextNegative.push( { original: text, lowercase: text.toLowerCase() } );
            // this.updateLocalFiltering();
        }
    }
     */

}
