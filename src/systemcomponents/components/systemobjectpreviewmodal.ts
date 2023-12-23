/**
 * @module SystemComponents
 */
import { Component, EventEmitter, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {language} from '../../services/language.service';

/**
 * a modal that renders and provides a preview for an object
 */
@Component({
    selector: 'system-object-preview-modal',
    templateUrl: '../templates/systemobjectpreviewmodal.html'
})
export class SystemObjectPreviewModal {

    /**
     * reference to the modal itself
     */
    public self: any = {};

    /**
     * the type of the object that will be passed in
     */
    @Input() public type: string = '';

    /**
     * the name of the object. This is displayed in the header
     */
    @Input() public name: string = '';

    /**
     * can be set to true to display a page not available error
     *
     * @private
     */
    @Input() public loadingerror: boolean = false;

    /**
     * holds data input sent by trigger
     */
    @Input() public data: any;

    /**
     * To tell the SystemObjectPreview component that the download button has been clicked.
     */
    public downloadTrigger$ = new EventEmitter<void>;

    constructor(public language: language, public sanitizer: DomSanitizer) {
    }

    /**
     * handles closing the modal
     */
    public closeModal() {
        this.self.destroy();
    }
}
