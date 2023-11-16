/**
 * @module ModuleSpiceAttachments
 */
import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {language} from "../../../services/language.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {SystemInputMedia} from "../../../systemcomponents/components/systeminputmedia";
import {Subject} from "rxjs";

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
    selector: 'spice-attachment-add-image-modal',
    templateUrl: '../templates/spiceattachmentaddimagemodal.html',
})
export class SpiceAttachmentAddImageModal {

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * loads the input component
     */
    @ViewChild(SystemInputMedia, {static: false}) public inputMedia;

    /**
     * the base64 encoded image string, bound to the ngModel of the input
     */
    public filecontent: string = '';

    /**
     * an event emitter with the image data
     */
    @Output() public imagedata: EventEmitter<imageData> = new EventEmitter<imageData>();

    /**
     * holds system category id
     */
    public systemCategoryId: string = '';

    /**
     * observable subject
     */
    public responseSubject: Subject<any> = new Subject<any>();

    constructor(public language: language, public modelattachments: modelattachments) {

    }

    /**
     * closes the dialog
     */
    public close() {
        this.self.destroy();
    }

    /**
     * emits that the image shoudl be added
     */
    public add() {
        // get the image data fromn the uploader
        let mediaMetaData = this.inputMedia.mediaMetaData;

        // upload the attachment
        this.modelattachments.uploadFileBase64( this.filecontent, mediaMetaData.filename, mediaMetaData.mimetype, this.systemCategoryId);

        // emit when upload finished
        this.responseSubject.next(true);
        this.responseSubject.complete();

        this.self.destroy();
    }

}
