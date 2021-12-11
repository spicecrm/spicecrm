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
    templateUrl: '../templates/quilleditorcontainer.html'
})
export class QuillEditorContainer implements AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy {
    /**
     * holds the simple mode boolean value to display some or all toolbar actions
     */
    @Input() public readonly simpleMode: boolean = false;
    /**
     * holds the disabled value to handle the editor disabled
     */
    @Input() public readonly disabled: boolean = false;
    /**
     * holds parent height number from parent
     */
    @Input() public readonly heightStyle: string = '300px';
    /**
     * scrolling container to be passed to the editor
     */
    @Input() public scrollingContainer?: HTMLElement | string | null;
    /**
     * to render the quill editor inside
     */
    @ViewChild('editorContainer', {read: ViewContainerRef, static: false}) public editorContainer: ViewContainerRef;
    /**
     * to read the quill toolbar and pass it to the editor
     */
    @ViewChild('editorToolbar', {read: ViewContainerRef, static: false}) public editorToolbar: ViewContainerRef;
    /**
     * to save the quill editor instance
     */
    public quillEditor: any;
    /**
     * to save the local content value
     */
    public content: any;
    /**
     * save text change handler function for editor
     */
    public textChangeHandler: () => void;
    /**
     * save on touched function for ControlValueAccessor
     */
    public onTouched: () => void;
    /**
     * save on change function for ControlValueAccessor
     */
    public onChange: (modelValue: any) => void;
    /**
     * save full screen on/off
     */
    public isFullScreenOn: boolean = false;
    /**
     * to help encoding/decoding html
     */
    public textarea: HTMLElement;
    /**
     * save the typing timeout
     */
    public typingTimeout: any;

    constructor(
        public elementRef: ElementRef,
        public domSanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) public platformId: any,
        public renderer: Renderer2,
        public modal: modal,
        public libLoader: libloader,
        public cdRef: ChangeDetectorRef,
        public zone: NgZone
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
    public encodeHtml(value: string) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * get clean html value by ensuring the encode/decode the code snippets
     */
    public getCleanHtml() {
        const regexp = /(?<=<pre class="ql-syntax" spellcheck="false">)[\s\S]*?(?=<\/pre>)/g;
        const match = regexp.exec(
            this.decodeHTMLEntities(this.content)
        );
        if (!match) return this.content;
        return this.content.replace(match.toString(), this.encodeHTMLEntities(match.toString()));
    }

    public decodeHTMLEntities(text) {
        this.textarea.innerHTML = text;
        return this.textarea.innerText;
    }

    public encodeHTMLEntities(text) {
        this.textarea.innerText = text;
        return this.textarea.innerHTML;
    }

    /**
     * handle text changes to emit the value
     */
    public registerTextChangeHandler() {

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
    public renderQuillEditor() {
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
    public openMediaFilePicker() {

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
    public openSourceEditor() {

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
    public toggleFullScreen(elementRef) {

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
