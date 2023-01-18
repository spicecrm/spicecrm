/**
 * @module WorkbenchModule
 */
import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    templateUrl: '../templates/crmlogviewermodal.html',
})
export class CRMLogViewerModal {

    /**
     * component inputs
     * @private
     */
    @Input() public entry: any;
    @Input() public user_name = '';

    /**
     * stati
     * @private
     */
    public isLoaded = false;
    public isLoading = true;

    public jsonResponse: any;

    public self;

    constructor(public language: language, public backend: backend, public toast: toast, public prefs: userpreferences) {
    }

    public ngOnInit() {
        // When the full text already has been retrieved from the backend
        // (because this modal for this log entry has already been shown)
        // the data is still stored (property "fullDescription") and we don´t need to do the request again:
        if (this.entry.fullDescription) {
            this.isLoading = !(this.isLoaded = true);
        } else {
            this.loadFullData();
        }
    }

    /**
     * Load the full data (with the un-truncated log text) and merge the full text to the record got from parent component.
     * @private
     */
    public loadFullData() {
        this.backend.getRequest('admin/crmlog/entry/' + this.entry.id).subscribe({
                next: (response) => {
                    this.isLoaded = true;
                    this.isLoading = false;
                    this.entry.fullDescription = response.entry.description;
                    // try to parse the json
                    try {
                        this.jsonResponse = JSON.parse(response.entry.description);
                    } catch(e){
                        this.jsonResponse = false;
                    }
                },
                error: () => {
                    this.toast.sendToast('Error loading entry of log file!', 'error', 'Entry ' + this.entry.id + ' of CRM log couldn´t be fetched.', false);
                    this.isLoading = false;
                }
            }
        );
    }

    get formattedJson(){
        return JSON.stringify(this.jsonResponse, null, '\t');
    }

    /**
     * Close the modal
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     * Escape pressed or [x] clicked.
     */
    public onModalEscX() {
        this.closeModal();
    }

}
