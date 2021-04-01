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
