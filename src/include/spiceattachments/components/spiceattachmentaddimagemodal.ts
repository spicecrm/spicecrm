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
        this.modelattachments.uploadFileBase64(this.filecontent.substring(this.filecontent.indexOf('base64,') + 7), mediaMetaData.filename, mediaMetaData.mimetype);

        this.self.destroy();
    }

}
