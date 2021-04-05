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
 * @module DirectivesModule
 */
import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {language} from "../../services/language.service";

/**
 * highlights the wrapped element to notify that this element is draggable and emit the dropped files
 */
@Directive({
    selector: '[system-drop-file]' // spiceDropFileArea
})
export class SystemDropFile {

    @Output('system-drop-file') public filesDrop: EventEmitter<FileList> = new EventEmitter<FileList>();
    @Input() private dropMessage: string;
    private overlayElement: HTMLElement;
    private dragStartListener: any;
    private dragEnterListener: any;
    private dragOverListener: any;
    private dragLeaveListener: any;
    private dragEndListener: any;
    private dragDropListener: any;
    private dragGlobalDropListener: any;
    private dragDepth: number = 0;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private language: language,
    ) {
        this.defineOverlayElement();
        this.listenWindowEvents();
    }

    /**
     * reset the drop message if it is defined as input
     */
    public ngOnChanges() {
        this.renderer.setProperty(this.overlayElement, 'textContent', this.dropMessage);
    }

    public ngOnDestroy() {
        this.dragStartListener();
        this.dragEnterListener();
        this.dragOverListener();
        this.dragLeaveListener();
        this.dragEndListener();
        this.dragDropListener();
        this.dragGlobalDropListener();
    }

    /**
     * define an overlay div
     */
    private defineOverlayElement() {
        this.overlayElement = this.renderer.createElement('div');
        this.renderer.setStyle(this.overlayElement, 'height', '100%');
        this.renderer.setStyle(this.overlayElement, 'width', '100%');
        this.renderer.setStyle(this.overlayElement, 'top', '0');
        this.renderer.setStyle(this.overlayElement, 'left', '0');
        this.renderer.setStyle(this.overlayElement, 'position', 'absolute');
        this.renderer.setStyle(this.overlayElement, 'background', 'rgba(135,135,135,0.8)');
        this.renderer.setStyle(this.overlayElement, 'color', '#fff');
        this.renderer.setStyle(this.overlayElement, 'border', 'dashed 2px #fff');
        this.renderer.setProperty(this.overlayElement, 'textContent', this.language.getLabel('LBL_DROP_FILES'));
        this.renderer.addClass(this.overlayElement, 'slds-align--absolute-center');

        // set relative position to the reference
        this.renderer.addClass(this.elementRef.nativeElement, 'slds-is-relative');
    }

    private listenWindowEvents() {

        /**
         * catch drag start as this is heppening when the drag is initiated within the application
         */
        this.dragStartListener = this.renderer.listen('window', 'dragstart', () => {
            this.dragDepth = -10;
        });

        /**
         * listen to dragenter, increase counter and on one emit boracast so the resp directive canm catch this
         */
        this.dragEnterListener = this.renderer.listen('window', 'dragenter', () => {
            this.dragDepth++;
            if (this.dragDepth == 1) {
                this.renderer.appendChild(this.elementRef.nativeElement, this.overlayElement);
            }
        });

        /**
         * listen to drag over event and allow dropping.
         */
        this.dragOverListener = this.renderer.listen(this.overlayElement, 'dragover', (dragOver) => {
            dragOver.preventDefault();
            dragOver.stopPropagation();
            dragOver.dataTransfer.dropEffect = 'copy';
        });

        /**
         * listen to dragleave, decrease counter and on one emit boracast so the resp directive can catch this
         */
        this.dragLeaveListener = this.renderer.listen('window', 'dragleave', () => {
            this.dragDepth--;
            if (this.dragDepth == 0) {
                this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
            }
        });

        /**
         * reset the depth to 0 when the drag is ending
         */
        this.dragEndListener = this.renderer.listen('window', 'dragend', () => {
            this.dragDepth = 0;
            this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
        });

        /**
         * listen to drop event and emit it.
         */
        this.dragDropListener = this.renderer.listen(this.overlayElement, 'drop', (drop) => {
            this.dragDepth = 0;
            if (drop.dataTransfer.files.length > 0) this.filesDrop.emit(drop.dataTransfer.files);
            this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
        });

        /**
         * listen to global drop and remove the overlay element
         */
        this.dragGlobalDropListener = this.renderer.listen('window', 'drop', (drop) => {
            this.dragDepth = 0;
            this.renderer.removeChild(this.elementRef.nativeElement, this.overlayElement);
        });
    }

    /**
     * helper to check if all elements of the drag over event are files
     *
     * @param items the items from the event
     */
    private hasOneItemsFile(items) {
        for (let item of items) {
            if (item.kind == 'file') {
                return true;
            }
        }
        return false;
    }
}
