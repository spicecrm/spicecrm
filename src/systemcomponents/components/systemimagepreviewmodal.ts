import {Component, EventEmitter, OnInit, Input} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/systemcomponents/templates/systemimagepreviewmodal.html'
})
export class SystemImagePreviewModal {

    private self: any = {};
    @Input() private imgsrc: string = '';
    @Input() private imgtype: string = '';
    @Input() private imgname: string = '';

    constructor(private language: language) {
    }

    private closeModal() {
        this.self.destroy();
    }

    private download() {
        let blob = this.b64toBlob(this.imgsrc.replace('data:' + this.imgtype + ';base64,', ''), this.imgtype);
        let blobUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = blobUrl;
        a.download = this.imgname;
        a.click();
        a.remove();
    }

    private b64toBlob(b64Data, contentType = '', sliceSize = 512) {

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
