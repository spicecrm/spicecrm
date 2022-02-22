/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * renders a PDF container based on a Base64 Input
 */
@Component({
    selector: 'system-pdf-container',
    templateUrl: '../templates/systempdfcontainer.html'
})
export class SystemPDFContainer {
    /**
     * the base 64 encoded content
     */
    @Input() public pdf: string;

    constructor(public sanitizer: DomSanitizer) {
    }
}
