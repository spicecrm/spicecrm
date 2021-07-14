/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
