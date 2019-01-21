import { Component, EventEmitter } from '@angular/core';
import { language } from '../../services/language.service';

declare var moment: any;

@Component({
    templateUrl: './src/workbench/templates/crmlogviewer.html',
    styles: [
        'input::placeholder { font-style: italic; color: #666 !important; }'
    ]
})
export class CRMLogViewer {

    // Configuration:
    private levels = [ 'debug', 'info', 'warn', 'deprecated', 'error', 'fatal', 'security' ];
    private limit = '5000';

    // Various:
    private filter = { level: 'fatal', processId: '', userId: '', text: '', transactionId: '' };
    private period = { year: '', month: '', day: '', hour: '' };

    private load$ = new EventEmitter();

    constructor( private lang: language ) { }

    // Are all the inputs correct and ready for the backend request?
    private canLoad() {
        if ( this.period.year && !this.period.year.match(/^\d{4}$/) ) return false;
        if ( this.filter.processId && !this.filter.processId.match(/\d$/) ) return false;
        if ( this.limit && !this.limit.match(/\d$/) ) return false;
        if ( this.period.hour && !this.period.day ) return false;
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
        let daysInMonth = ( !this.period.month || !this.period.year ) ? 31 : this.daysInMonth( this.period.month, this.period.year );
        let list = [];
        for ( let i=1; i <= daysInMonth; i++ ) list.push( ( i < 10 ? '0':'' ) + i );
        return list;
    }

    // Check, if the year input field has a valid value.
    private checkYear() {
        return this.period.year.match(/^\d{4}$/);
    }

    private changedYear() {
        if ( !this.period.year ) this.period.month = this.period.day = this.period.hour = '';
    }
    private changedHour() {
        if ( this.period.hour ) {
            this.setYearNow();
            this.setMonthNow();
            this.setDayNow();
        }
    }
    private changedDay() {
        if ( !this.period.day ) this.period.hour = '';
        else {
            this.setYearNow();
            this.setMonthNow();
        }
    }
    private changedMonth() {
        if ( !this.period.month ) this.period.day = this.period.hour = '';
        else {
            if ( this.period.day && parseInt( this.period.day, 10 ) > this.daysInMonth( this.period.month, this.period.year )) this.period.day = '';
            this.setYearNow();
        }
    }

    private setYearNow() {
        if ( !this.period.year ) this.period.year = (new Date()).getFullYear().toString();
    }
    private setMonthNow() {
        if ( !this.period.month ) {
            this.period.month = ((new Date()).getMonth()+1).toString();
            if ( this.period.month.length === 1 ) this.period.month = '0'+this.period.month;
        }
    }
    private setDayNow() {
        if( !this.period.day ) {
            this.period.day = (new Date()).getDate().toString();
            if ( this.period.day.length === 1 ) this.period.day = '0'+this.period.day;
        }
    }

    // The values in the list can be clicked to be transfered to the corresponding filter input field.
    private valueClicked( click: any ) {
        let items: string[];
        switch ( click.type ) {
            case 'date':
                items = click.value.split('\.');
                this.period.day = items[0];
                this.period.month = items[1];
                this.period.year = items[2];
                break;
            case 'time':
                items = click.value.split(':');
                this.period.hour = items[0];
                break;
            case 'tid': this.filter.transactionId = click.value; break;
            case 'uid': this.filter.userId = click.value; break;
            case 'lev': this.filter.level = click.value; break;
            case 'pid': this.filter.processId = click.value.toString(); break;
        }
    }

}
