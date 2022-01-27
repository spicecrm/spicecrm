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
    templateUrl: '../templates/campaigntaskmailmergemodal.html'
})
export class CampaignTaskMailMergeModal {

    /**
     * reference to the modal itself
     * @private
     */
    public self: any;

    /**
     * the total number of records
     *
     * @private
     */
    public totalCount: number = 0;

    /**
     * the starting number (starts at 1 .. calculated back to 0 indexed for the backend)
     * @private
     */
    public start: number = 1;

    /**
     * the number of pages to be generated
     * todo: set a limit in teh backend config and respect that
     *
     * @private
     */
    public limit: number = 100;

    /**
     * the count of inactive items from the target group
     *
     * @public
     *
     */
    public inactiveCount: number = 0;

    public loading: boolean = false;

    /**
     * the loaded pdf
     *
     * @private
     */
    public pdf: any;

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    public blobUrl: any;

    constructor(
        public language: language,
        public model: model,
        public backend: backend,
        public modal: modal,
        public sanitizer: DomSanitizer,
    ) {
        this.getCount();
    }

    /**
     * retrieves the number of records in the targetlsts to get an understanding of the nunber of pages that canbe generated
     * @private
     */
    public getCount() {
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
    public rendertemplate() {
        this.blobUrl = null;
        this.loading = true;
        this.backend.getRequest(`module/CampaignTasks/${this.model.id}/mailmerge`, {
            start: this.start - 1,
            limit: this.limit
        }).subscribe(
            results => {
                this.pdf = results.content;
                // send the inactiveCount to be displayed in front-end
                this.inactiveCount = results.inactiveCount;
                let blob = this.datatoBlob(atob(results.content));
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
    public datatoBlob(byteCharacters, contentType = '', sliceSize = 512) {
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
     * @public
     */
    public download() {
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
    public close() {
        this.self.destroy();
    }

}
