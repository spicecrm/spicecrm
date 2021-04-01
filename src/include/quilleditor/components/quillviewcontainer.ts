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
 * @module QuillEditorModule
 */

import {isPlatformServer} from '@angular/common';

import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnChanges,
    PLATFORM_ID,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {libloader} from "../../../services/libloader.service";

/** @ignore */
declare var Quill: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'quill-view',
    templateUrl: './src/include/quilleditor/templates/quillviewcontainer.html'
})
export class QuillViewContainer implements AfterViewInit, OnChanges {
    /**
     * save the content to be displayed in the editor view mode
     */
    @Input() protected readonly content: string;
    /**
     * holds the disabled value to handle the editor disabled
     */
    @Input() protected readonly heightStyle: string = '300px';
    /**
     * save the full height boolean
     */
    @Input() protected readonly fullHeight: boolean = false;
    /**
     * to render the quill editor inside
     */
    @ViewChild('editorContainer', {read: ViewContainerRef, static: false}) private editorContainer: ViewContainerRef;
    /**
     * to save the quill editor instance
     */
    private quillEditor: any;
    /**
     * to help encoding/decoding html
     */
    private textarea: HTMLElement;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private libLoader: libloader,
        private zone: NgZone
    ) {
        this.textarea = document.createElement('textarea');
    }

    /**
     * set the editor content
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.content) {
            this.setEditorContent();
        }
    }

    /**
     * call to render quill editor in view mode
     * set the editor content
     */
    public ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) return;
        this.renderQuillEditor();
    }

    /**
     * render the quill editor with the defined options and toolbar and pass the content
     */
    private renderQuillEditor() {
        this.libLoader.loadLib('QuillEditor').subscribe(() => {
            this.zone.runOutsideAngular(() => {
                this.quillEditor = new Quill(this.editorContainer.element.nativeElement, {
                    modules: {toolbar: false},
                    readOnly: true,
                    strict: true,
                    theme: 'snow'
                });

                this.setEditorContent();
            });
        });
    }

    /**
     * set the editor content
     */
    private setEditorContent(): any {

        if (!this.quillEditor) return;
        this.quillEditor.setContents(
            this.quillEditor.clipboard.convert(this.getCleanHtml())
        );

    }

    /**
     * get clean html value by ensuring the encode/decode the code snippets
     */
    private getCleanHtml() {
        if (!this.content) return '';
        const regexp = /(?<=<pre class="ql-syntax" spellcheck="false">)[\s\S]*?(?=<\/pre>)/g;
        const match = regexp.exec(
            this.decodeHTMLEntities(this.content)
        );
        if (!match) return this.content;
        return this.content.replace(match.toString(), this.encodeHTMLEntities(match.toString()));
    }

    private decodeHTMLEntities(text) {
        this.textarea.innerHTML = text;
        return this.textarea.innerText;
    }

    private encodeHTMLEntities(text) {
        this.textarea.innerText = text;
        return this.textarea.innerHTML;
    }
}
