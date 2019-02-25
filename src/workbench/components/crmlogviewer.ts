import { Component, EventEmitter } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';

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
