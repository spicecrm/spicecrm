/**
 * @module WorkbenchModule
 */
import { Component, EventEmitter } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';

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
    private log_levels = [ 'debug', 'info', 'warn', 'deprecated', 'login', 'error', 'fatal', 'security' ];

    // Various:
    private filter = { log_level: 'fatal', pid: '', user_id: '', text: '', transaction_id: '', end: undefined };
    private filterUserName: string;

    // private dateEnd: any;

    private limit = '250';

    private load$ = new EventEmitter();

    private countEntries: number;

    private setNow() {
        this.filter.end = new moment();
    }

    private set filterUser( idAndName: string ) {
        if (!idAndName) {
            this.filter.user_id = '';
            this.filterUserName = undefined;
            return;
        }
        const valueArray = idAndName.split('::');
        this.filter.user_id = valueArray[0];
        this.filterUserName = valueArray[1];
    }

    private get filterUser(): string {
        if ( !this.filter.user_id ) return undefined;
        return this.filter.user_id+'::'+this.filterUserName;
    }

    constructor( private lang: language, private backend: backend, private modal: modal, private toast: toast ) { }

    // Are all the inputs correct and ready for the backend request?
    private canLoad() {
        if ( this.filter.pid && !this.filter.pid.match(/\d$/) ) return false;
        return true;
    }

    // Load button was pressed.
    private buttonLoad() {
        this.load$.emit();
    }

    // The values in the list can be clicked to be transfered to the corresponding filter input field.
    private valueClicked( type: string, value: any ) {
        switch ( type ) {
            case 'date_entered':
                this.filter.end = new moment( value ); break;
            case 'transaction_id': this.filter.transaction_id = value; break;
            case 'user': {
                this.filter.user_id = value.user_id;
                this.filterUserName = value.user_name;
                break;
            }
            case 'log_level': this.filter.log_level = value; break;
            case 'pid': this.filter.pid = value.toString(); break;
        }
    }

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
        );
    }

}
