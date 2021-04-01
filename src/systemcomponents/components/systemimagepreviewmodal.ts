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
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/systemcomponents/templates/systemimagepreviewmodal.html'
})
export class SystemImagePreviewModal {

    /**
     * reference to the modal itself
     * @private
     */
    private self: any = {};

    /**
     * the soruce of the image
     * @private
     */
    @Input() private imgsrc: string = '';

    /**
     * type of the image
     * @private
     */
    @Input() private imgtype: string = '';

    /**
     * the name of the image
     * @private
     */
    @Input() private imgname: string = '';

    /**
     * can be set to true to display a page not available error
     * 
     * @private
     */
    @Input() private loadingerror: boolean = false;

    constructor(private language: language) {
    }

    /**
     * cloes the modal
     *
     * @private
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * triggered form the download button
     *
     * @private
     */
    private download() {
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
