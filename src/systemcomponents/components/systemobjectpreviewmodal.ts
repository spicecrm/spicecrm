import {Component, EventEmitter, OnInit, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/systemcomponents/templates/systemobjectpreviewmodal.html'
})
export class SystemObjectPreviewModal {

    private self: any = {};
    @Input() private type: string = '';
    @Input() private name: string = '';
    private blobUrl: any;

    constructor(private language: language, private sanitizer: DomSanitizer) {
    }

    private closeModal() {
        this.self.destroy();
    }

    set data(data) {
        let blob = this.datatoBlob(data, this.type);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    }

    get objecttype() {
        if (!this.type) return '';

        let typeArray = this.type.split("/");
        switch (typeArray[0]) {
            case 'audio':
            case 'video':
                return typeArray[0];
            default:
                return 'object';
        }
    }

    private download() {
        let a = document.createElement("a");
        a.href = this.blobUrl;
        a.download = this.name;
        a.click();
        a.remove();
    }

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
}
