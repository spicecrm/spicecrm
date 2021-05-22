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
    templateUrl: './src/workbench/templates/apilogviewer.html'
})
export class APIlogViewer {

    // Configuration:
    private methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PATCH', 'PUT', 'SOAP', 'TRACE'];
    private limit = '250';

    // The log data from the backend:
    private entries: any[] = [];

    // The hole list of routes:
    private routes: any[];

    private routesIndexes = {};

    // Various:
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

    private filterUserName: string;

    private dateEnd: any;

    // Stati:
    private isLoading = false;

    @ViewChild('tbody', {static: true}) private tbody: ElementRef; // Reference to the tbody dom element of the data table.

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

    private get filterUser(): string {
        if (!this.filter.userId) return undefined;
        return this.filter.userId + '::' + this.filterUserName;
    }

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

    // Load button was pressed.
    private buttonLoad() {
        this.loadData();
    }

    /**
     * truncates the log
     * @private
     */
    private truncate() {
        this.modal.prompt('confirm', 'Truncate the API log and delete all entries?', 'Truncate API Log').subscribe(
            res => {
                if (res) {
                    this.isLoading = true;
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
                }
            }
        )
    }

    // Open the modal window to display a log entry with unusual long log text.
    private showEntryInModal(entry) {
        this.modal.openModal('APIlogViewerModal').subscribe(modal => {
            modal.instance.entry = entry;
        });
    }

    // Open the modal window to display a log entry with unusual long log text.
    private showCRMlog(transactionId: string) {
        this.modal.openModal('CRMLogViewerListModal').subscribe(modal => {
            modal.instance.filter = {transactionId: transactionId};
        });
    }


    // The values in the list can be clicked to be transfered to the corresponding filter input field.
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
