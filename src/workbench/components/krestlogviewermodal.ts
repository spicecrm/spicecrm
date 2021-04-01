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
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { language } from '../../services/language.service';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';

@Component({
    templateUrl: './src/workbench/templates/krestlogviewermodal.html',
})
export class KRESTLogViewerModal {

    @Input() private line: any;
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
        // When the full text already has been retrieved from the backend
        // (because this modal for this log line has already been shown)
        // the data is still stored (property "fullText") and we don´t need to do the request again:
        this.isLoaded = this.line.fullLoaded && true;
        if ( !this.isLoaded ) this.loadFullData();
    }

    // Load the full data (with the un-truncated log text) and merge the full text to the record got from parent component.
    private loadFullData() {
        this.isLoading = true;
        this.backend.getRequest( this.routeBase+'/fullLine/' + this.line.id ).subscribe(
            response => {
                this.isLoaded = true;
                this.isLoading = false;
                this.line.postParams = response.line.postParams;
                this.line.response = response.line.response;
                this.line.headers = response.line.headers;
                this.line.fullLoaded = true;
            },
            error => {
                this.toast.sendToast('Error loading line of log file!', 'error', 'Line '+this.line.lnr+' of log file '+this.line.fnr+' couldn´t be fetched.', false );
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
            return JSON.stringify(JSON.parse(this.line[param]), null, '\t');
        } catch (e) {
            return this.line[param];
        }
    }
}
