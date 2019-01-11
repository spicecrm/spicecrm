import { Component, ViewChild, ElementRef } from '@angular/core';
import { backend } from '../../services/backend.service';
import { metadata } from '../../services/metadata.service';
import { language } from '../../services/language.service';
import { userpreferences } from '../../services/userpreferences.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';

declare var moment: any;

@Component({
    templateUrl: './src/workbench/templates/krestlogviewer.html',
    styles: [
        'td.expanded { white-space: normal; }',
        'td.expanded div { overflow-wrap: break-word; }',
        'td.collapsed > div { position: absolute; top:0; bottom:0; right:0; left:0; padding: calc(0.25rem + 4px) calc(0.5rem + 0px); }',
        'input::placeholder { font-style: italic; color: #666 !important; }'
    ]
})
export class KRESTLogViewer {

    // Configuration:
    private routeBase = 'krestlog';
    private methods = [ 'DELETE', 'GET', 'POST', 'PUT' ];
    private limit = '5000';
    private linesPerPage = 20;

    // The log data from the backend:
    private lines: any[] = [];
    private linesToShow: any[] = []; // Same as lines if no text filter is applied.

    // The hole list of CRM users:
    private userlist: any[];
    private userlistIndexes = {};

    // The hole list of routes:
    private routes: any[];
    private routesIndexes = {};

    // Various:
    private currPage = 1;
    private filter = { method: 'POST', sessionId: '', userId: '', urlParams: '', postParams: '', routeArgs: '', ipAddress: '', url: '', route: '' };
    private period = { year: '', month: '', day: '', hour: '' };
    private filtertext = '';
    private yearNow: string;
    private toastId = '';
    private modal: any;
    private lineNrInModal: number;

    // Stati:
    private isLoading = false;
    private isLoaded = false;
    private isBuildingTextfilter = false;

    @ViewChild('tbody') private tbody: ElementRef; // Reference to the tbody dom element of the data table.

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

    private changedYear() {
        if ( !this.period.year.length ) this.period.month = this.period.day = this.period.hour = '';
    }

    private changedMonth() {
        if ( !this.period.month.length ) this.period.day = this.period.hour = '';
    }

    private changedDay() {
        if ( !this.period.day.length ) this.period.hour = '';
    }

    // Load the log lines from the backend.
    private loadData() {

        if ( !this.canLoad()) return; // Check if all input fields (filter and limit) are valid and we can load.

        let route = this.routeBase;
        this.isLoading = true;
        this.isLoaded = false;
        this.linesToShow = [];
        this.filtertext = '';

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
            method: this.filter.method.length ? this.filter.method : undefined,
            route: this.filter.route.length ? this.filter.route : undefined,
            theUrl: this.filter.url.length ? this.filter.url : undefined, // "theUrl" because "url" doesn't work. proxy?
            userId: this.filter.userId.length ? this.filter.userId : undefined,
            routeArgs: this.filter.routeArgs.length ? this.filter.routeArgs : undefined,
            postParams: this.filter.postParams.length ? this.filter.postParams : undefined,
            urlParams: this.filter.urlParams.length ? this.filter.urlParams : undefined,
            ipAddress: this.filter.ipAddress.length ? this.filter.ipAddress : undefined,
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
        if ( this.isLoading ) return false;
        if ( this.period.year.length && !this.period.year.match(/^\d{4}$/) ) return false;
        if ( this.limit.length && !this.limit.match(/\d$/) ) return false;
        return true;
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
    private showLineInModal( lineNr ) {
        if ( !this.modal || this.modal.instance.isClosed ) {
            this.modalservice.openModal( 'KRESTLogViewerModal' ).subscribe( modal => {
                this.modal = modal;
                this.modal.instance.routeBase = this.routeBase;
                this.modal.instance.nrOfLines = this.linesToShow.length;
                this.handOverModalData( lineNr );
                this.lineNrInModal = lineNr;
                modal.instance.toLeft$.subscribe( () => {
                    if ( this.lineNrInModal > 0 ) this.showLineInModal( --this.lineNrInModal );
                });
                modal.instance.toRight$.subscribe( () => {
                    if ( this.lineNrInModal < this.linesToShow.length-1 ) this.showLineInModal( ++this.lineNrInModal );
                });
            } );
        } else {
            this.handOverModalData( lineNr );
        }
    }

    private handOverModalData( lineNr ) {
        this.currPage = Math.ceil( (lineNr+1) / 20 );
        this.modal.instance.lineNr = lineNr;
        this.modal.instance.line = this.linesToShow[lineNr];
        this.modal.instance.username = this.getUsername( this.linesToShow[lineNr].uid );
        this.modal.instance.load();
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
