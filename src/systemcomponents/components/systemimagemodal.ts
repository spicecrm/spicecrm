/**
 * @module SystemComponents
 */
import { Component, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { language } from '../../services/language.service';

@Component({
    selector: 'system-image-modal',
    templateUrl: './src/systemcomponents/templates/systemimagemodal.html'
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
     * The data of the image (base64, leaded by the file format, delimited by '|').
     */
    private imageData: string = null;

    /**
     * Observable for submitting the image.
     */
    private answer: Observable<boolean|string> = null;

    /**
     * Subject for submitting the image.
     */
    private answerSubject: Subject<boolean|string> = null;

    /**
     * Reference for the modal.
     */
    private self: any;

    constructor( private language: language ) {
        this.answerSubject = new Subject();
        this.answer = this.answerSubject.asObservable();
    }

    /**
     * Cancel button clicked.
     */
    private cancel(): void {
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * Is allowed to save (click save button)?
     */
    private get canSave(): boolean {
        return !!this.imageData;
    }

    /**
     * Save button clicked.
     */
    private save(): void {
        if ( !this.canSave ) return;
        this.answerSubject.next( this.imageData );
        this.answerSubject.complete();
        this.self.destroy();
    }

    public onModalEscX() {
        this.cancel();
    }

}
