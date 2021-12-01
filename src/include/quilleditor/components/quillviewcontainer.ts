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
    templateUrl: '../templates/quillviewcontainer.html'
})
export class QuillViewContainer implements AfterViewInit, OnChanges {
    /**
     * save the content to be displayed in the editor view mode
     */
    @Input() public readonly content: string;
    /**
     * holds the disabled value to handle the editor disabled
     */
    @Input() public readonly heightStyle: string = '300px';
    /**
     * save the full height boolean
     */
    @Input() public readonly fullHeight: boolean = false;
    /**
     * to render the quill editor inside
     */
    @ViewChild('editorContainer', {read: ViewContainerRef, static: false}) public editorContainer: ViewContainerRef;
    /**
     * to save the quill editor instance
     */
    public quillEditor: any;
    /**
     * to help encoding/decoding html
     */
    public textarea: HTMLElement;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public renderer: Renderer2,
        public elementRef: ElementRef,
        public libLoader: libloader,
        public zone: NgZone
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
    public renderQuillEditor() {
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
    public setEditorContent(): any {

        if (!this.quillEditor) return;
        this.quillEditor.setContents(
            this.quillEditor.clipboard.convert(this.getCleanHtml())
        );

    }

    /**
     * get clean html value by ensuring the encode/decode the code snippets
     */
    public getCleanHtml() {
        if (!this.content) return '';
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
}
