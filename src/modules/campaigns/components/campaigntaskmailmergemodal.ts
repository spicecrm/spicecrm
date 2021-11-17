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
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {DomSanitizer} from "@angular/platform-browser";

declare var moment: any;

@Component({
    selector: 'campaigntask-mailerge-modal',
    templateUrl: './src/modules/campaigns/templates/campaigntaskmailmergemodal.html'
})
export class CampaignTaskMailMergeModal {

    /**
     * reference to the modal itself
     * @private
     */
    private self: any;

    /**
     * the total number of records
     *
     * @private
     */
    private totalCount: number = 0;

    /**
     * the starting number (starts at 1 .. calculated back to 0 indexed for the backend)
     * @private
     */
    private start: number = 1;

    /**
     * the number of pages to be generated
     * todo: set a limit in teh backend config and respect that
     *
     * @private
     */
    private limit: number = 100;

    private loading: boolean = false;

    /**
     * the loaded pdf
     *
     * @private
     */
    private pdf: any;

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    private blobUrl: any;

    constructor(
        private language: language,
        private model: model,
        private backend: backend,
        private modal: modal,
        public sanitizer: DomSanitizer,
    ) {
        this.getCount();
    }

    /**
     * retrieves the number of records in the targetlsts to get an understanding of the nunber of pages that canbe generated
     * @private
     */
    private getCount() {
        this.backend.getRequest(`module/CampaignTasks/${this.model.id}/targetcount`).subscribe(
            res => {
                this.totalCount = parseInt(res.count, 10);
                // if we have less than 100 records set the limit automatically
                if (this.totalCount < this.limit) this.limit = this.totalCount;
            }
        );
    }

    /**
     * getter if we can generate and all criteria are met
     */
    get canGenerate() {
        return this.totalCount > 0 && this.start && this.start > 0 && this.start <= this.totalCount && this.limit && (this.start + this.limit - 1) <= this.totalCount;
    }

    /**
     * backend call to render the template and return the content
     */
    private rendertemplate() {
        this.blobUrl = null;
        this.loading = true;
        this.backend.getRequest(`module/CampaignTasks/${this.model.id}/mailmerge`, {
            start: this.start - 1,
            limit: this.limit
        }).subscribe(
            pdf => {
                this.pdf = pdf.content;
                let blob = this.datatoBlob(atob(pdf.content));
                this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );
    }

    /**
     * internal function to translate the data to a BLOL URL
     *
     * @param byteCharacters the file data
     * @param contentType the type
     * @param sliceSize optional parameter to change performance
     */
    private datatoBlob(byteCharacters, contentType = '', sliceSize = 512) {
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
     * download the pdf locally
     *
     * @private
     */
    private download() {
        // generate a link element for the download
        let a = document.createElement("a");
        document.body.appendChild(a);

        // generate a blob file from the content
        // base64 decode in case wehave a PDF
        let blob = this.datatoBlob(atob(this.pdf));
        let blobUrl = URL.createObjectURL(blob);

        // set as href and set the type
        a.href = blobUrl;
        a.type = 'application/pdf';

        // genereate a filename
        let fileName = `${this.model.getField('name')}_pages_${this.start}_to_${this.start + this.limit - 1}.pdf`;
        a.download = fileName;

        // start download and then remove the element from the document again
        a.click();
        a.remove();
    }

    /**
     * closes the modal
     * @private
     */
    private close() {
        this.self.destroy();
    }

}
