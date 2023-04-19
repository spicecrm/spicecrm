/**
 * @module WorkbenchModule
 */
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';
import { userpreferences } from '../../services/userpreferences.service';

declare var moment: any;

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: '../templates/crmlogviewer.html'
})
export class CRMLogViewer {

    /**
     * filter
     * @private
     */
    public filter = { loglevel: '', subloglevel: '', pid: '', user_id: '', text: '', transaction_id: '', end: undefined };
    public filterUserName: string;

    /**
     * Limit: maximal entries from the backend.
     * @private
     */
    public limit: number = 250;

    public load$ = new EventEmitter();

    /**
     * The number of entries got from the backend.
     * @private
     */
    public countEntries: number;

    /**
     * Set the filter field "end" to now.
     * @private
     */
    public setNow() {
        this.filter.end = new moment();
    }

    /**
     * Set the filter field "user".
     * @param idAndName
     * @private
     */
    public set filterUser( idAndName: string ) {
        if (!idAndName) {
            this.filter.user_id = '';
            this.filterUserName = undefined;
            return;
        }
        const valueArray = idAndName.split('::');
        this.filter.user_id = valueArray[0];
        this.filterUserName = valueArray[1];
    }

    /**
     * Get the value from filter field "user".
     * @private
     */
    public get filterUser(): string {
        if ( !this.filter.user_id ) return undefined;
        return this.filter.user_id+'::'+this.filterUserName;
    }

    constructor( public lang: language, public backend: backend, public modal: modal, public toast: toast, public userpreferences: userpreferences ) { }

    /**
     * Are all the inputs correct and ready for the backend request?
     * @private
     */
    public canLoad() {
        if ( this.filter.pid && !this.filter.pid.match(/\d$/) ) return false;
        return true;
    }

    /**
     * Load button was pressed.
     */
    public buttonLoad() {
        this.load$.emit();
    }

    /**
     * The values in the list can be clicked to be transfered to the corresponding filter input field.
     * @param type Kind of value.
     * @param value The value.
     * @private
     */
    public valueClicked( type: string, value: any ) {
        switch ( type ) {
            case 'date_entered':
                this.filter.end = new moment.utc( value ).tz( this.userpreferences.toUse.timezone ); break;
            case 'transaction_id': this.filter.transaction_id = value; break;
            case 'user': {
                this.filter.user_id = value.user_id;
                this.filterUserName = value.user_name;
                break;
            }
            case 'log_level':
                this.filter.loglevel = value;
                break;
            case 'log_sublevel':
                this.filter.subloglevel = value;
                break;
            case 'pid':
                this.filter.pid = value.toString();
                break;
        }
    }

    /**
     * truncates the log
     * @private
     */
    public truncate() {
        this.modal.prompt('confirm', 'Truncate the API log and delete all entries?', 'Empty the API Log?').subscribe(
            res => {
                if (res) {
                    this.backend.deleteRequest('admin/crmlog').subscribe(
                        () => {
                            this.load$.emit();
                        },
                        () => {
                            this.toast.sendToast('Error truncating log', 'error');
                        }
                    );
                }
            }
        );
    }

}
