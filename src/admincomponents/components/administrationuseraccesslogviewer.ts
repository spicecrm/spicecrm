/**
 * @module WorkbenchModule
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: '../templates/administrationuseraccesslogviewer.html'
})
export class AdministrationUserAccessLogViewer {

    /**
     * the limit of records to fetch in on go
     * @private
     */
    public limit = '250';

    /**
     * a filter for the username or IP
     * @private
     */
    public filter: string = '';

    /**
     * a date end to go back from in the search
     * @private
     */
    public dateEnd: any;

    /**
     * inidicates that we are loading
     *
     * @private
     */
    public isLoading = false;

    /**
     * set if failed only shoudl be loaded
     *
     * @private
     */
    public failedOnly: boolean = false;

    /**
     * the entries retrieved
     *
     * @private
     */
    public entries: any[] = [];

    constructor(public backend: backend, public modal: modal, public toast: toast) {

    }

    public setNow() {
        this.dateEnd = new moment();
    }

    // Load the log entries from the backend.
    public loadData() {

        if (!this.isLoading) {

            this.isLoading = true;

            // Build the query parameters for the request:
            let queryParams: any = {
                limit: this.limit
            };
            if (this.filter) queryParams.filter = this.filter;
            if (this.failedOnly) queryParams.failedonly = this.failedOnly;
            if (this.dateEnd) queryParams.date_end = this.dateEnd.format('YYYY-MM-DD HH:mm:ss');

            // request to the backend
            this.backend.getRequest('admin/useraccesslog', queryParams).subscribe(
                response => {
                    this.entries = response;
                    this.isLoading = false;
                },
                error => {
                    this.toast.sendToast('Error loading log data!', 'error');
                    this.isLoading = false;
                }
            );
        }
    }

    /**
     * loads more entries
     *
     * @private
     */
    public loadMore() {
        if (!this.isLoading) {

            this.isLoading = true;
            // Build the query parameters for the request:
            let queryParams: any = {
                limit: this.limit,
                date_end: this.entries[this.entries.length - 1].date_entered
            };
            if (this.filter) queryParams.filter = this.filter;
            if (this.failedOnly) queryParams.failedonly = this.failedOnly;

            // request to the backend
            this.backend.getRequest('admin/useraccesslog', queryParams).subscribe(
                response => {
                    this.entries = this.entries.concat(response);
                    this.isLoading = false;
                },
                error => {
                    this.toast.sendToast('Error loading log data!', 'error');
                    this.isLoading = false;
                }
            );
        }
    }

    // Load button was pressed.
    public buttonLoad() {
        this.loadData();
    }

}
