/**
 * @module SystemComponents
 */
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * renders a PDF container based on a Base64 Input
 */
@Component({
    selector: 'system-pdf-container',
    templateUrl: '../templates/systempdfcontainer.html'
})
export class SystemPDFContainer implements OnChanges{
    /**
     * the base 64 encoded content
     */
    @Input() public pdf: string;

    /**
     * the blob url for the pdf display
     */
    public blobUrl: any;

    constructor(public sanitizer: DomSanitizer) {}

    /**
     * on changes reset the blob url and build a new one
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        this.blobUrl = null;
        if(this.pdf) {
            let blob = this.dataToBlob(atob(this.pdf));
            this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        }
    }

    /**
     * internal function to translate the data to a Blob URL
     * @param byteCharacters the file data
     */
    protected dataToBlob(byteCharacters) {
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            let slice = byteCharacters.slice(offset, offset + 512);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays);
    }
}
