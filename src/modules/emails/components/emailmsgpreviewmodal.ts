/*
SpiceUI 2021.01.001

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
import {DomSanitizer} from '@angular/platform-browser';
import {language} from '../../../services/language.service';
import {libloader} from '../../../services/libloader.service';

declare var MSGReader: any;

/**
 * a modal that renders and provides a preview for an object
 */
@Component({
    templateUrl: './src/modules/emails/templates/emailmsgpreviewmodal.html'
})
export class EmailMSGPreviewModal {

    /**
     * reference to the modal itself
     */
    private self: any = {};

    /**
     * the type of the object that will be passed in
     */
    @Input() private type: string = '';

    /**
     * the name of the object. This is displayed in the header
     */
    @Input() private name: string = '';

    private libsloaded: boolean = false;

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    private blobUrl: any;

    private msgData: any;

    constructor(private language: language, private sanitizer: DomSanitizer, private libloader: libloader) {

    }

    /**
     * handles closing the modal
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * a setter for the data
     *
     * @param data the raw data of the object being passed in. When the data is pased in the bloburl is created
     */
    set data(data) {
        this.libloader.loadLib('msgreader').subscribe(loaded => {
            // let msgReader = new MSGReader(Uint8Array.from(data, c => c.charCodeAt(0)));
            // this.msgData = msgReader.getFileData();
        });
    }

    get subject() {
        if (this.msgData) {
            return this.msgData.subject;
        } else {
            return '';
        }
    }

    get body() {
        if (this.msgData) {
            return this.sanitizer.bypassSecurityTrustHtml(this.msgData.body.replace(/\n/g, "<br/>"));
        } else {
            return '';
        }
    }

    /**
     * translates the type passed in into the proper obejcttype
     */
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

    /**
     * a download option in teh window that triggers creation of a link elekent and simulates a click. This will prompt the download in the UI
     */
    private download() {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = this.blobUrl;
        a.download = this.name;
        a.click();
        a.remove();
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
}
