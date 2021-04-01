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
 * @module ModuleSpiceAttachments
 */
import {
    Component, OnInit, Input, NgZone, Output, EventEmitter, ViewChild, ViewContainerRef, Renderer2, Injector
} from '@angular/core';
import {language} from "../../../services/language.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {SystemInputMedia} from "../../../systemcomponents/components/systeminputmedia";

/**
 * the image data the event emitter emits
 */
interface imageData {
    filename: string;
    filetype: string;
    filecontent: string;
}

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentaddimagemodal.html',
})
export class SpiceAttachmentAddImageModal {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     * loads the input component
     */
    @ViewChild(SystemInputMedia, {static: false}) public inputMedia;

    /**
     * the base64 encoded image string, bound to the ngModel of the input
     */
    private filecontent: string = '';

    /**
     * an event emitter with the image data
     */
    @Output() private imagedata: EventEmitter<imageData> = new EventEmitter<imageData>();

    constructor(private language: language, private modelattachments: modelattachments) {

    }

    /**
     * closes the dialog
     */
    private close() {
        this.self.destroy();
    }

    /**
     * emits that the image shoudl be added
     */
    private add() {
        // get the image data fromn the uploader
        let mediaMetaData = this.inputMedia.mediaMetaData;

        // upload the attachment
        this.modelattachments.uploadFileBase64( this.filecontent, mediaMetaData.filename, mediaMetaData.mimetype );

        this.self.destroy();
    }

}
