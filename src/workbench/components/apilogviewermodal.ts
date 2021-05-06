/**
 * @module WorkbenchModule
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';

@Component({
    templateUrl: './src/workbench/templates/apilogviewermodal.html',
})
export class APIlogViewerModal {

    @Input() private entry: any;
    @Input() private username = '';
    @Input() private routeBase: string;
    @Input() private canSwitchToLeft: boolean;
    @Input() private canSwitchToRight: boolean;

    @Output() public toLeft$ = new EventEmitter();
    @Output() public toRight$ = new EventEmitter();

    // Stati:
    private isLoaded = false;
    private isLoading = false;
    private isClosed = false;

    private nrOfLines: number;
    private lineNr: number;

    private self;

    constructor( private language: language, private backend: backend, private toast: toast ) { }

    private ngOnInit() {
    }

    public load() {
        console.log('load!');
        // When the full text already has been retrieved from the backend
        // (because this modal for this log entry has already been shown)
        // the data is still stored (property "fullText") and we don´t need to do the request again:
        this.isLoaded = this.entry.fullLoaded && true;
        if ( !this.isLoaded ) this.loadFullData();
    }

    // Load the full data (with the un-truncated log text) and merge the full text to the record got from parent component.
    private loadFullData() {
        this.isLoading = true;
        this.backend.getRequest( this.routeBase+'/entry/'+ this.entry.id ).subscribe(
            response => {
                this.isLoaded = true;
                this.isLoading = false;
                this.entry.postParams = response.entry.postParams;
                this.entry.response = response.entry.response;
                this.entry.headers = response.entry.headers;
                this.entry.fullLoaded = true;
            },
            error => {
                this.toast.sendToast('Error loading entry of log file!', 'error', 'Entry '+this.entry.id+' of REST log couldn´t be fetched.', false );
                this.isLoading = false;
            });
    }

    private canLeft() {
        return !this.isLoading && this.lineNr > 0;
    }
    private canRight() {
        return !this.isLoading && this.lineNr < this.nrOfLines-1;
    }

    // Close the modal.
    private closeModal() {
        this.isClosed = true;
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }

    /**
     * get the headers formatted
     */
    private formatted(param) {
        try {
            return JSON.stringify(JSON.parse(this.entry[param]), null, '\t');
        } catch (e) {
            return this.entry[param];
        }
    }
}
