/**
 * @module WorkbenchModule
 */
import { Component, EventEmitter } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import {toast} from '../../services/toast.service';

declare var moment: any;

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
    private routeBase = 'admin/crmlog';

    // Various:
    private filter = { level: 'fatal', processId: '', userId: '', text: '', transactionId: '', start: undefined, end: undefined };
    // private period = { type: '', start: { year: '', month: '', day: '', hour: '' }, begin: { year: '', month: '', day: '', hour: '' }, duration: '1' };
    private filterUserName: string;

    private load$ = new EventEmitter();

    private countEntries: number;

    private set filterUser( idAndName: string ) {
        if (!idAndName) {
            this.filter.userId = '';
            this.filterUserName = undefined;
            return;
        }
        const valueArray = idAndName.split('::');
        this.filter.userId = valueArray[0];
        this.filterUserName = valueArray[1];
    }

    private get filterUser(): string {
        if ( !this.filter.userId ) return undefined;
        return this.filter.userId+'::'+this.filterUserName;
    }

    private get filterStart() {
        return this.filter.start;
    }

    private set filterStart( value) {
        this.filter.start = value;
        // if ( moment.isMoment( this.filter.start ) && !moment.isMoment( this.filter.end )) this.filter.end = this.filter.start.clone();
        // this.filterStd2Alt();
    }

    private get filterEnd() {
        return this.filter.end;
    }

    private set filterEnd( value) {
        this.filter.end = value;
        // this.filterStd2Alt();
    }

    private altTimeInput = false;

    constructor( private lang: language, private backend: backend, private modal: modal, private toast: toast ) { }

    // Are all the inputs correct and ready for the backend request?
    private canLoad() {
        // if ( this.period.begin.year && !this.period.begin.year.match(/^\d{4}$/) ) return false;
        if ( this.filter.processId && !this.filter.processId.match(/\d$/) ) return false;
        // if ( this.period.begin.hour && !this.period.begin.day ) return false;
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

    /*
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
    */

    // The values in the list can be clicked to be transfered to the corresponding filter input field.
    private valueClicked( type: string, value: any ) {
        switch ( type ) {
            case 'datetime':
                this.filter.start = new moment( value ); break;
            case 'tid': this.filter.transactionId = value; break;
            case 'usr': {
                this.filter.userId = value.uid;
                this.filterUserName = value.uname;
                break;
            }
            case 'lev': this.filter.level = value; break;
            case 'pid': this.filter.processId = value.toString(); break;
        }
    }

    /*
    private sanitizeDuration() {
        if ( !this.period.duration.match( /\d+/ )) this.period.duration = '1';
    }

    private get durationLabel() {
        let labels = {
            year: 'LBL_YEARS',
            month: 'LBL_MONTHS',
            day: 'LBL_DAYS',
            hour: 'LBL_HOURS'
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
    */

    /**
     * truncates the log
     * @private
     */
    private truncate() {
        this.modal.prompt('confirm', 'Truncate the API log and delete all entries?', 'Empty the API Log?').subscribe(
            res => {
                if (res) {
                    // this.isLoading = true;
                    this.backend.deleteRequest('admin/crmlog').subscribe(
                        () => {
                            // this.isLoading = false;
                            this.load$.emit();
                        },
                        () => {
                            this.toast.sendToast('Error truncating log', 'error');
                            // this.isLoading = false;
                        }
                    );
                }
            }
        )
    }

}
