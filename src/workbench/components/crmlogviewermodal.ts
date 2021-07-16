/**
 * @module WorkbenchModule
 */
import { Component, Input } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { userpreferences } from '../../services/userpreferences.service';

@Component({
    templateUrl: './src/workbench/templates/crmlogviewermodal.html',
})
export class CRMLogViewerModal {

    /**
     * component inputs
     * @private
     */
    @Input() private entry: any;
    @Input() private user_name = '';

    /**
     * stati
     * @private
     */
    private isLoaded = false;
    private isLoading = true;

    private self;

    constructor( private language: language, private backend: backend, private toast: toast, private prefs: userpreferences ) { }

    private ngOnInit() {
        // When the full text already has been retrieved from the backend
        // (because this modal for this log entry has already been shown)
        // the data is still stored (property "fullDescription") and we don´t need to do the request again:
        if ( this.entry.fullDescription ) this.isLoading = !( this.isLoaded = true );
        else this.loadFullData();
    }

    /**
     * Load the full data (with the un-truncated log text) and merge the full text to the record got from parent component.
     * @private
     */
    private loadFullData() {
        this.backend.getRequest( 'admin/crmlog/entry/'+this.entry.id ).subscribe(
            response => {
                this.isLoaded = true;
                this.isLoading = false;
                this.entry.fullDescription = response.entry.description;
            },
            error => {
                this.toast.sendToast('Error loading entry of log file!', 'error', 'Entry '+this.entry.id+' of CRM log couldn´t be fetched.', false );
                this.isLoading = false;
            });
    }

    /**
     * Close the modal
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * Escape pressed or [x] clicked.
     */
    public onModalEscX() {
        this.closeModal();
    }

}
