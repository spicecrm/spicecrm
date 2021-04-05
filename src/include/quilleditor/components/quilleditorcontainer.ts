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
 * @module QuillEditorModule
 */

import {isPlatformServer} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    PLATFORM_ID,
    Renderer2,
    SecurityContext,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {QuillModulesI} from "../interfaces/quilleditor.interfaces";
import {modal} from "../../../services/modal.service";
import {libloader} from "../../../services/libloader.service";

/** @ignore */
declare var Quill: any;

/**
 * render a quill rich text editor and handle its changes
 */
@Component({
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => QuillEditorContainer)
        }
    ],
    selector: 'quill-editor',
    templateUrl: './src/include/quilleditor/templates/quilleditorcontainer.html'
})
export class QuillEditorContainer implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy {
    /**
     * holds the simple mode boolean value to display some or all toolbar actions
     */
    @Input() protected readonly simpleMode: boolean = false;
    /**
     * holds the disabled value to handle the editor disabled
     */
    @Input() protected readonly disabled: boolean = false;
    /**
     * holds parent height number from parent
     */
    @Input() protected readonly heightStyle: string = '300px';
    /**
     * scrolling container to be passed to the editor
     */
    @Input() private scrollingContainer?: HTMLElement | string | null;
    /**
     * to render the quill editor inside
     */
    @ViewChild('editorContainer', {read: ViewContainerRef, static: false}) private editorContainer: ViewContainerRef;
    /**
     * to read the quill toolbar and pass it to the editor
     */
    @ViewChild('editorToolbar', {read: ViewContainerRef, static: false}) private editorToolbar: ViewContainerRef;
    /**
     * to save the quill editor instance
     */
    private quillEditor: any;
    /**
     * to save the local content value
     */
    private content: any;
    /**
     * save text change handler function for editor
     */
    private textChangeHandler: () => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    private onTouched: () => void;
    /**
     * save on change function for ControlValueAccessor
     */
    private onChange: (modelValue: any) => void;
    /**
     * save full screen on/off
     */
    private isFullScreenOn: boolean = false;
    /**
     * to help encoding/decoding html
     */
    private textarea: HTMLElement;
    /**
     * save the typing timeout
     */
    private typingTimeout: any;

    constructor(
        private elementRef: ElementRef,
        private domSanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: any,
        private renderer: Renderer2,
        private modal: modal,
        private libLoader: libloader,
        private cdRef: ChangeDetectorRef,
        private zone: NgZone
    ) {
        this.textarea = document.createElement('textarea');
    }

    /**
     * call to render the quill editor
     */
    public ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) return;

        this.zone.runOutsideAngular(() =>
            this.renderQuillEditor()
        );
    }

    /**
     * remove the change listener from the editor
     */
    public ngOnDestroy() {
        if (this.quillEditor) {
            this.quillEditor.off('text-change', this.textChangeHandler);
        }
    }

    /**
     * set disabled value
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {

        if (!this.quillEditor) return;

        if (changes.disabled) {
            this.setDisabledState();
        }
    }

    /**
     * register on change ControlValueAccessor
     * @param fn
     */
    public registerOnChange(fn: any) {
        this.onChange = (val) => {
            fn(val);
        };
    }

    /**
     * register on touched function by ControlValueAccessor
     * @param fn
     */
    public registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    /**
     * write value by ControlValueAccessor
     * encode the html value and set the editor content
     * @param value
     */
    public writeValue(value: any) {

        this.content = value;
        if (!this.quillEditor) return;

        if (!value) {
            this.quillEditor.setText('');
        } else {
            this.content = this.getCleanHtml();
            this.quillEditor.setContents(
                this.quillEditor.clipboard.convert(
                    this.domSanitizer.sanitize(SecurityContext.HTML, this.content)
                )
            );
        }
    }

    /**
     * set disabled state for the editor
     */
    public setDisabledState(): void {

        if (!this.quillEditor) return;

        if (this.disabled) {
            this.quillEditor.disable();
            this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled');
        } else {
            this.quillEditor.enable();
            this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
        }
    }

    /**
     * encode html value
     * @param value
     */
    protected encodeHtml(value: string) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * get clean html value by ensuring the encode/decode the code snippets
     */
    private getCleanHtml() {
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

    /**
     * handle text changes to emit the value
     */
    private registerTextChangeHandler() {

        this.textChangeHandler = () => {

            if (this.typingTimeout) {
                window.clearTimeout(this.typingTimeout);
            }
            this.typingTimeout = window.setTimeout(() => {
                this.zone.run(() => {
                    const html = this.editorContainer.element.nativeElement.querySelector('.ql-editor')!.innerHTML;
                    const value = html === '<p><br></p>' || html === '<div><br></div>' ? null : html;
                    this.content = value;
                    this.onChange(value);
                });
            }, 1000);
        };
    }

    /**
     * render the quill editor with the defined options and toolbar and pass the content
     */
    private renderQuillEditor() {
        const modules: QuillModulesI = {
            toolbar: this.editorToolbar.element.nativeElement,
            imageResize: {
                displaySize: true
            }
        };
        this.libLoader.loadLib('QuillEditor').subscribe(() => {

            this.quillEditor = new Quill(this.editorContainer.element.nativeElement, {
                bounds: this.editorContainer.element.nativeElement,
                modules: modules,
                scrollingContainer: this.scrollingContainer,
                strict: true,
                theme: 'snow'
            });

            if (this.content) {
                this.content = this.domSanitizer.sanitize(SecurityContext.HTML, this.content);
                const contents = this.quillEditor.clipboard.convert(this.content);
                this.quillEditor.setContents(contents, 'silent');
                this.quillEditor.history.clear();
            }

            this.setDisabledState();

            this.registerTextChangeHandler();
            this.quillEditor.on('text-change', this.textChangeHandler);
        });
    }

    /**
     * open meidla file picker modal
     */
    private openMediaFilePicker() {

        this.modal.openModal('MediaFilePicker').subscribe(componentRef => {
            componentRef.instance.answer.subscribe(image => {
                if (!image) return;

                const range = this.quillEditor.getSelection();
                const index = range ? range.index : 0;

                if (image.upload) {
                    this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                        uploadComponentRef.instance.answer.subscribe(uploadimage => {
                            if (uploadimage) {
                                this.quillEditor.insertEmbed(index, 'image', 'https://cdn.spicecrm.io/' + uploadimage);
                            }
                        });
                    });
                } else {
                    if (image.id) {
                        this.quillEditor.insertEmbed(index, 'image', 'https://cdn.spicecrm.io/' + image.id);
                    }
                }
            });
        });
    }

    /**
     * open source editor modal
     */
    private openSourceEditor() {

        this.modal.openModal('QuillSourceEditorModal').subscribe(componentRef => {
            componentRef.instance._html = this.content;
            componentRef.instance.html.subscribe(newHtml => {
                // update our internal value
                this.writeValue(newHtml);
            });
        });
    }

    /**
     * cross browser toggle full screen mode
     */
    private toggleFullScreen(elementRef) {

        // define the full screen change handler
        document.onfullscreenchange = () => {
            this.isFullScreenOn = !!document.fullscreenElement;
            this.cdRef.detectChanges();
        };

        this.zone.runOutsideAngular(() => {

            if (!this.isFullScreenOn) {
                if (elementRef.requestFullscreen) {
                    elementRef.requestFullscreen();
                } else if (elementRef.webkitRequestFullScreen) {
                    elementRef.webkitRequestFullScreen();
                } else if (elementRef.mozRequestFullscreen) {
                    elementRef.mozRequestFullscreen();
                } else if (elementRef.msRequestFullscreen) elementRef.msRequestFullscreen();
            } else {
                const documentRef = (document as any);
                if (documentRef.exitFullscreen) {
                    documentRef.exitFullscreen();
                } else if (documentRef.webkitExitFullscreen) {
                    documentRef.webkitExitFullscreen();
                } else if (documentRef.mozCancelFullScreen) {
                    documentRef.mozCancelFullScreen();
                } else if (documentRef.msExitFullscreen) documentRef.msExitFullscreen();
            }
        });
    }
}
