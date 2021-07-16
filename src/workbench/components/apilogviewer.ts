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

/**
 * the api log viwer rendered as part of the admin setion in the system
 */
@Component({
    templateUrl: './src/workbench/templates/apilogviewer.html'
})
export class APIlogViewer {

    /**
     * the methods allowed for selection in teh filter
     * @private
     */
    private methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'PUT', 'SOAP', 'TRACE'];

    /**
     * the load limit in the list
     *
     * @private
     */
    private limit = '250';

    /**
     * the data loaded fromt he backend
     * @private
     */
    private entries: any[] = [];

    /**
     * an object holding the filter settings
     *
     * @private
     */
    private filter = {
        method: '',
        session_id: '',
        userId: '',
        term: '',
        ip: '',
        route: '',
        status: '',
        direction: ''
    };

    /**
     * the username picked forthe filtered userid
     * @private
     */
    private filterUserName: string;

    /**
     * the date end set in the filters
     * @private
     */
    private dateEnd: any;

    /**
     * inidcates that we are loading
     *
     * @private
     */
    private isLoading = false;

    /**
     * sets the filter for a specific user
     *
     * @param idAndName
     * @private
     */
    private set filterUser(idAndName: string) {
        if (!idAndName) {
            this.filter.userId = '';
            this.filterUserName = undefined;
            return;
        }
        const valueArray = idAndName.split('::');
        this.filter.userId = valueArray[0];
        this.filterUserName = valueArray[1];
    }

    /**
     * returns the data for the set user filter
     *
     * @private
     */
    private get filterUser(): string {
        if (!this.filter.userId) return undefined;
        return this.filter.userId + '::' + this.filterUserName;
    }

    constructor(private backend: backend, private modal: modal, private toast: toast) {

    }

    /**
     * littel helper to enable the user to set a default date with now
     *
     * @private
     */
    private setNow() {
        this.dateEnd = new moment();
    }

    /**
     * loads the data from teh backend
     *
     * @private
     */
    private loadData() {

        if (!this.isLoading) {

            this.isLoading = true;

            // Build the query parameters for the request:
            let queryParams: any = {
                limit: this.limit
            };

            // check what other filters to add
            if (this.filter.method) queryParams.method = this.filter.method;
            if (this.filter.route) queryParams.route = this.filter.route;
            if (this.filter.userId) queryParams.user_id = this.filter.userId;
            if (this.filter.term) queryParams.filter = this.filter.term;
            if (this.filter.ip) queryParams.ip = this.filter.ip;
            if (this.filter.status) queryParams.status = this.filter.status;
            if (this.filter.session_id) queryParams.session_id = this.filter.session_id;
            if (this.filter.direction) queryParams.direction = this.filter.direction;
            if (this.dateEnd) queryParams.end = this.dateEnd?.utc().format('YYYY-MM-DD HH:mm:ss');

            // request to the backend
            this.backend.getRequest('admin/apilog', queryParams).subscribe(
                response => {
                    this.entries = response.entries;
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
     * button action for the load button
     * @private
     */
    private buttonLoad() {
        this.loadData();
    }

    /**
     * truncates the log
     *
     * @private
     */
    private truncate() {
        this.modal.prompt('confirm', 'Truncate the API log and delete all entries?', 'Truncate API Log').subscribe(
            res => {
                if (res) {
                    this.backend.deleteRequest('admin/apilog').subscribe(
                        () => {
                            this.isLoading = false;
                            this.loadData();
                        },
                        () => {
                            this.toast.sendToast('Error truncating log', 'error');
                            this.isLoading = false;
                        }
                    );
                    this.isLoading = true;
                }
            }
        );
    }

    /**
     * open the entry in a modal with all details
     *
     * @param entry
     * @private
     */
    private showEntryInModal(entry) {
        this.modal.openModal('APIlogViewerModal').subscribe(modal => {
            modal.instance.entry = entry;
        });
    }

    /**
     * open a CRM Log viewer modal with thetransaction
     * ToDo: reimplement this
     *
     * @param transaction_id
     * @private
     */
    private showCRMlog(transaction_id: string) {
        this.modal.openModal('CRMLogViewerListModal').subscribe(modal => {
            modal.instance.filter = {transaction_id: transaction_id};
        });
    }


    /**
     * reacts when a value was clicked and helps set a filter with the clicked value
     *
     * @param type
     * @param value
     * @private
     */
    private valueClicked(type: string, value: any) {
        let items: string[];
        switch (type) {
            case 'route':
                this.filter.route = value;
                break;
            case 'method':
                this.filter.method = value;
                break;
            case 'status':
                this.filter.status = value;
                break;
            case 'dir':
                this.filter.direction = value;
                break;
        }
    }
}
