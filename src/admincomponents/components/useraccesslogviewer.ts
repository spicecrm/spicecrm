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
    templateUrl: './src/admincomponents/templates/useraccesslogviewer.html'
})
export class UserAccessLogViewer {

    /**
     * the limit of records to fetch in on go
     * @private
     */
    private limit = '250';

    /**
     * a filter for the username or IP
     * @private
     */
    private filter: string = '';

    /**
     * a date end to go back from in the search
     * @private
     */
    private dateEnd: any;

    /**
     * inidicates that we are loading
     *
     * @private
     */
    private isLoading = false;

    /**
     * set if failed only shoudl be loaded
     *
     * @private
     */
    private failedOnly: boolean = false;

    /**
     * the entries retrieved
     *
     * @private
     */
    private entries: any[] = [];

    constructor(private backend: backend, private modal: modal, private toast: toast) {

    }

    private setNow() {
        this.dateEnd = new moment();
    }

    // Load the log entries from the backend.
    private loadData() {

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
    private loadMore() {
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
    private buttonLoad() {
        this.loadData();
    }

}
