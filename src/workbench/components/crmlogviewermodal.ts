import { Component, Input } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';

@Component({
    templateUrl: './src/workbench/templates/crmlogviewermodal.html',
})
export class CRMLogViewerModal {

    @Input() private line: any;
    @Input() private username = '';
    @Input() private routeBase: string;

    // Stati:
    private isLoaded = false;
    private isLoading = true;

    private self;

    constructor( private language: language, private backend: backend, private toast: toast ) { }

    private ngOnInit() {
        // When the full text already has been retrieved from the backend
        // (because this modal for this log line has already been shown)
        // the data is still stored (property "fullText") and we don´t need to do the request again:
        if ( this.line.fullText ) this.isLoading = !( this.isLoaded = true );
        else this.loadFullData();
    }

    // Load the full data (with the un-truncated log text) and merge the full text to the record got from parent component.
    private loadFullData() {
        this.backend.getRequest( this.routeBase+'/fullLine/' + this.line.id ).subscribe(
            response => {
                this.isLoaded = true;
                this.isLoading = false;
                this.line.fullText = response.line.txt;
            },
            error => {
                this.toast.sendToast('Error loading line of log file!', 'error', 'Line '+this.line.lnr+' of log file '+this.line.fnr+' couldn´t be fetched.', false );
                console.log(error);
                this.isLoading = false;
            });
    }

    // Close the modal.
    private closeModal() {
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }

}
