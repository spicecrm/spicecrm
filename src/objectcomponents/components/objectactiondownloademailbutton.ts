/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {backend} from "../../services/backend.service";
import {model} from "../../services/model.service";
import {helper} from "../../services/helper.service";

/**
 * standard actionset item to download an attachment
 */
@Component({
    selector: 'object-action-download-email-button',
    templateUrl: '../templates/objectactiondownloademailbutton.html'
})
export class ObjectActionDownloadEmailButton {

    /**
     * reference id will be sent with each backend request to enable canceling the pending requests
     */
    public httpRequestsRefID: string = window._.uniqueId('model_attachments_http_ref_');

    /**
     * holds the action config
     */
    public actionconfig: any = {};

    constructor(
        public backend: backend,
        public helper: helper,
        public model: model
    ) {

    }
    get hidden() {
        return !this.model.getField('file_md5');
    }

    /**
     * triggers the download of the file
     */
    public execute() {
        this.backend.getRequest(`module/attachment/${this.model.module}/${this.model.id}`, null, this.httpRequestsRefID).subscribe(fileData => {
            let blob = this.helper.b64toBlob(fileData.file, fileData.file_mime_type);
            let blobUrl = URL.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = blobUrl;
            a.download = fileData.filename;
            a.type = fileData.file_mime_type;
            a.click();
            a.remove();
        });
    }
}