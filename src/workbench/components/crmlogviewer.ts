import { Component, ViewChild, ElementRef } from '@angular/core';
import { backend } from '../../services/backend.service';
import { metadata } from '../../services/metadata.service';
import { language } from '../../services/language.service';
import { userpreferences } from '../../services/userpreferences.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';

declare var moment: any;

@Component({
    templateUrl: './src/workbench/templates/crmlogviewer.html',
    styles: [
        'td.expanded { white-space: normal; }',
        'td.expanded div { overflow-wrap: break-word; }',
        'td.collapsed > div { position: absolute; top:0; bottom:0; right:0; left:0; padding: calc(0.25rem + 4px) calc(0.5rem + 0px); }'
    ]
})
export class CRMLogViewer {

    // Configuration:
    private routeBase = 'crmlog';
    private levels = [ 'debug', 'info', 'warn', 'deprecated', 'error', 'fatal', 'security' ];
    private limit = '5000';
    private linesPerPage = 20;

    // The log data from the backend:
    private lines: any[] = [];
    private linesToShow: any[] = []; // Same as lines if no text filter is applied.

    // The hole list of CRM users:
    private userlist: any[];
    private userlistIndexes = {};

    // Various:
    private currPage = 1;
    private filter = { level: 'fatal', processId: '', userId: '' };
    private period = { year: '', month: '', day: '', hour: '' };
    private filtertext = '';
    private yearNow: string;

    // Stati:
    private isLoading = false;
    private isLoaded = false;
    private isBuildingTextfilter = false;

    @ViewChild('tbody') private tbody: ElementRef; // Reference to the tbody dom element of the data table.

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences, private modalservice: modal, private toast: toast ) {
        // Load all CRM users to have their user names. Needed to map the user ids given by the log lines:
        /* TEMPORARY DISABLED. See Ticket SPICEUI-159.
        this.backend.getRequest( 'module/Users' ).subscribe( response => {
            this.userlist = response.list;
            this.userlist.forEach( ( val, i ) => {
                this.userlistIndexes[val.id] = i;
            });
        });
        */
        this.yearNow = (new Date()).getFullYear().toString();
    }

    // Get the name for a specific user.
    private getUsername( userId ) {
        if ( !userId || !this.userlistIndexes.hasOwnProperty( userId )) return userId;
        return this.userlist[this.userlistIndexes[userId]].user_name;
    }

    // Load the log lines from the backend.
    private loadData() {

        if ( !this.canLoad()) return; // Check if all input fields (filter and limit) are valid and we can load.

        let route = this.routeBase;
        this.isLoading = true;
        this.isLoaded = false;
        this.linesToShow = [];

        // Build the REST route:
        if ( this.period.year.length ) {
            if ( this.period.month.length ) {
                if ( this.period.day.length ) {
                    if ( this.period.hour.length ) {
                        route += '/day/'+this.period.year+this.period.month+this.period.day+'/hour/'+this.period.hour;
                    } else {
                        route += '/day/' + this.period.year + this.period.month + this.period.day;
                    }
                } else {
                    route += '/month/'+this.period.year+this.period.month;
                }
            } else route += '/year/'+this.period.year;
        }

        // Build the query parameters for the request:
        let queryParams = {
            limit: this.limit.length ? this.limit : undefined,
            level: this.filter.level.length ? this.filter.level : undefined,
            processId: this.filter.processId.length ? this.filter.processId : undefined,
            userId: this.filter.userId.length ? this.filter.userId : undefined,
        };
        this.backend.getRequest( route, queryParams ).subscribe(
        response => {
                this.lines = response.lines;
                this.lines.forEach( ( line, i ) => {
                    line.date = moment.unix( line.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getDateFormat() );
                    line.time = moment.unix( line.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getTimeFormat() );
                    line.i = i;
                });
                this.doTextFilter();
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
        if ( this.period.year.length && !this.period.year.match(/^\d{4}$/) ) return false;
        if ( this.filter.processId.length && !this.filter.processId.match(/\d$/) ) return false;
        if ( this.limit.length && !this.limit.match(/\d$/) ) return false;
        return true;
    }

    // After the angular-rendering we check for every line / table row, if the log text is truncated by the browser (because it wouldn´t fit into column) or not.
    // The trick to detect truncation: When scrollWidth > clientWidth.
    private ngAfterViewChecked() {
        let htmlTableRows;
        if ( this.tbody && this.tbody.nativeElement ) {
            htmlTableRows = this.tbody.nativeElement.childNodes;
            if ( htmlTableRows ) {
                // We iterate the tbody, but we skip non tr elements and any dom elements not containing log data (for example: angular comments).
                htmlTableRows.forEach( ( row ) => {
                    if( row.tagName !== 'TR' || row.childNodes.length < 2 ) return;
                    let div = row.childNodes[5].childNodes[0];
                    row.childNodes[6].childNodes[0].style.visibility = ( div.scrollWidth === div.clientWidth ? 'hidden':'auto' ); // Show the expand button only when the div is not (yet) truncated.
                });
            }
        }
    }

    // Load button was pressed.
    private buttonLoad() {
        this.loadData();
    }

    // Get the number of days for a specific month/year (28, 29, 30 or 31).
    private daysInMonth( month, year ) {
        return new Date( year, month, 0 ).getDate();
    }

    // Get a simple array of day numbers (for ngIf).
    private get daylist() {
        let list = [];
        for ( let i=1; i <= this.daysInMonth( parseInt( this.period.month, 10 ), parseInt( this.period.year, 10 )); i++ ) list.push( ( i < 10 ? '0':'' ) + i );
        return list;
    }

    // Check, if the year input field has a valid value.
    private checkYear() {
        return this.period.year.match(/^\d{4}$/);
    }

    // Open the modal window to display a log line with unusual long log text.
    private showLineInModal(i) {
        this.modalservice.openModal('CRMLogViewerModal' ).subscribe( modal => {
            modal.instance.line = this.linesToShow[i];
            modal.instance.username = this.getUsername( this.linesToShow[i].uid );
            modal.instance.routeBase = this.routeBase;
        });
    }

    // Apply filter text to the list. Or clear filtering when no filter text.
    private doTextFilter() {
        if ( !this.filtertext.length ) {
            if ( this.isFiltered ) this.clearTextFilter(); // this.resetLinesToShow();
        } else {
            if ( this.lines.length) this.buildLinesToShow();
        }
    }

    // Iterate the lines to build the filtered list.
    private buildLinesToShow() {
        this.isBuildingTextfilter = true;
        this.linesToShow = [];
        this.lines.forEach( line => {
            if( line.txt.toLowerCase().indexOf( this.filtertext.toLowerCase() ) !== -1 ) this.linesToShow.push( line ); // todo: change to regex (might be faster than changing all the text to uppercase)
        });
        this.currPage = 1;
        window.setTimeout( () => this.isBuildingTextfilter = false, 750 );
    }

    // Remove filter.
    private clearTextFilter() {
        this.filtertext = '';
        if ( this.isFiltered ) this.resetLinesToShow();
    }

    private resetLinesToShow() {
        this.isBuildingTextfilter = true; // Changes opacity of the table (for a moment), to indicate that the table is changed.
        this.linesToShow = [];
        this.lines.forEach( line => {
            this.linesToShow.push( line );
        });
        this.currPage = 1;
        window.setTimeout( () => this.isBuildingTextfilter = false, 750 );
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

}
