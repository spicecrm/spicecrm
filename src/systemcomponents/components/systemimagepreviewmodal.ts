/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    templateUrl: '../templates/systemimagepreviewmodal.html'
})
export class SystemImagePreviewModal {

    /**
     * reference to the modal itself
     * @private
     */
    public self: any = {};

    /**
     * the soruce of the image
     * @private
     */
    @Input() public imgsrc: string = '';

    /**
     * type of the image
     * @private
     */
    @Input() public imgtype: string = '';

    /**
     * the name of the image
     * @private
     */
    @Input() public imgname: string = '';

    /**
     * can be set to true to display a page not available error
     * 
     * @private
     */
    @Input() public loadingerror: boolean = false;

    constructor(public language: language) {
    }

    /**
     * cloes the modal
     *
     * @private
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     * triggered form the download button
     *
     * @private
     */
    public download() {
        let blob = this.b64toBlob(this.imgsrc.replace('data:' + this.imgtype + ';base64,', ''), this.imgtype);
        let blobUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = blobUrl;
        a.download = this.imgname;
        a.click();
        a.remove();
    }

    /**
     * converts the base 64 stroing to a blbo and adds it as url so the file can be displayed
     *
     * @param b64Data
     * @param contentType
     * @param sliceSize
     * @private
     */
    public b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        let byteCharacters = atob(b64Data);
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
}
