/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';
import {helper} from "../../services/helper.service";

@Component({
    selector: 'system-image-preview-modal',
    templateUrl: '../templates/systemimagepreviewmodal.html'
})
export class SystemImagePreviewModal {

    /**
     * reference to the modal itself
     */
    public self: any = {};

    /**
     * the soruce of the image
     */
    @Input() public imgsrc: string = '';

    /**
     * type of the image
     */
    @Input() public imgtype: string = '';

    /**
     * the name of the image
     */
    @Input() public imgname: string = '';

    constructor(
        public language: language,
        public helper: helper) {
    }

    /**
     * cloes the modal
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     * triggered form the download button
     */
    public download() {
        let blob = this.helper.b64toBlob(this.imgsrc.replace('data:' + this.imgtype + ';base64,', ''), this.imgtype);
        let blobUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = blobUrl;
        a.download = this.imgname;
        a.click();
        a.remove();
    }

}
