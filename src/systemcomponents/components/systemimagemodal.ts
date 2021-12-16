/**
 * @module SystemComponents
 */
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { language } from '../../services/language.service';
import { SystemInputMedia } from './systeminputmedia';

@Component({
    selector: 'system-image-modal',
    templateUrl: '../templates/systemimagemodal.html'
})
export class SystemImageModal {

    /**
     * Title of the modal window.
     */
    @Input() public title = '';

    /**
     * Maximal pixel width of the image, when predefined from outside.
     */
    @Input() public maxWidth: number = null;

    /**
     * Maximal pixel height of the image, when predefined from outside.
     */
    @Input() public maxHeight: number = null;

    /**
     * Extern dropped file(s).
     */
    @Input() public droppedFiles: FileList = null;

    /**
     * Setter for the image data. Extracts the mimetype and the pure base64 image data.
     */
    @Input() public set imageData( val: string ) {
        this.mimetype = this.imageData_onlyBase64code = '';
        if ( val ) {
            let dummmy = val.split( ';', 2 );
            this.mimetype = dummmy[0];
            this.imageData_onlyBase64code = dummmy[1].slice( 7 );
        }
    }

    /**
     * The data of the image (base64, leaded by the file format, delimited by '|').
     */
    public imageData_onlyBase64code: string = null;

    /**
     * Observable for submitting the image.
     */
    public answer: Observable<boolean|string> = null;

    /**
     * Subject for submitting the image.
     */
    public answerSubject: Subject<boolean|string> = null;

    /**
     * The mimetype of the image.
     */
    public mimetype: string;

    /**
     * Reference for the modal.
     */
    public self: any;

    /**
     * reference to the image upload component
     */
    @ViewChild(SystemInputMedia) public systemInputMedia: SystemInputMedia;

    constructor( public language: language ) {
        this.answerSubject = new Subject();
        this.answer = this.answerSubject.asObservable();
    }

    /**
     * Cancel button clicked.
     */
    public cancel(): void {
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * Is allowed to save (click save button)?
     */
    public get canSave(): boolean {
        return !!this.imageData_onlyBase64code;
    }

    /**
     * Save button clicked.
     */
    public save(): void {
        if ( !this.canSave ) return;
        this.answerSubject.next( this.systemInputMedia.mediaMetaData.mimetype + ';base64,' + this.imageData_onlyBase64code );
        this.answerSubject.complete();
        this.self.destroy();
    }

    public onModalEscX() {
        this.cancel();
    }

}
