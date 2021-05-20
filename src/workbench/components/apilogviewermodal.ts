/**
 * @module WorkbenchModule
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';

@Component({
    templateUrl: './src/workbench/templates/apilogviewermodal.html',
})
export class APIlogViewerModal {

    /**
     * reference to itself for closing the modal
     * @private
     */
    private self;

    /**
     * the entry
     * @private
     */
    @Input() private entry: any;

    private record: any = {};

    /**
     * indicates we are loading
     *
     * @private
     */
    private isLoading = true;

    private activeTab: 'record' | 'headers' | 'post' | 'response' = 'record';

    constructor(private language: language, private backend: backend, private toast: toast) {
    }

    private ngOnInit() {
        this.loadFullData();
    }

    /**
     * Load the full data (with the un-truncated log text) and merge the full text to the record got from parent component.
     *
     * @private
     */
    private loadFullData() {
        this.isLoading = true;
        this.backend.getRequest(`admin/apilog/${this.entry.id}`).subscribe(
            response => {
                this.isLoading = false;
                this.record = response;
            },
            error => {
                this.toast.sendToast('Error loading entry of log file!', 'error', 'Entry ' + this.entry.id + ' of REST log couldn´t be fetched.', false);
                this.isLoading = false;
                this.close();
            });
    }

    /**
     * returns the parsed request headers as table
     */
    get requestHeaders() {
        if (this.record.headers) {
            try {
                let retArray = [];
                let headers = JSON.parse(this.record.headers);
                for (let entry in headers) {
                    retArray.push({
                        name: entry,
                        value: headers[entry]
                    });
                }
                return retArray;
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    /**
     * returns the parsed request headers as table
     */
    get requestArguments() {
        if (this.record.args) {
            try {
                let retArray = [];
                let args = JSON.parse(this.record.args);
                for (let arg in args) {
                    retArray.push({
                        name: arg,
                        value: args[arg]
                    });
                }
                return retArray;
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    /**
     * returns the parsed request Paramaters
     */
    get requestParams() {
        if (this.record.get_params) {
            try {
                let retArray = [];
                let params = JSON.parse(this.record.get_params);
                for (let param in params) {
                    retArray.push({
                        name: param,
                        value: params[param]
                    });
                }
                return retArray;
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    /**
     * retruns if we have a non empty request
     */
    get hasRequest() {
        return this.record.post_params && this.record.post_params != "{}";
    }

    /**
     * retruns if we have a non empty response
     */
    get hasResponse() {
        return this.record.response && this.record.response != "{}";
    }

    // Close the modal.
    private close() {
        this.self.destroy();
    }

    /**
     * get the headers formatted
     */
    private formatted(param) {
        try {
            return JSON.stringify(JSON.parse(this.record[param]), null, '\t');
        } catch (e) {
            return this.record[param];
        }
    }
}
