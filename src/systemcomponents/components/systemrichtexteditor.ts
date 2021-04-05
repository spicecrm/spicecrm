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
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    OnDestroy, OnInit, Output,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    Input
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DOCUMENT} from "@angular/common";

import {modal} from "../../services/modal.service";
import {systemrichtextservice} from "../services/systemrichtext.service";
import {MediaFileUploader} from "../../modules/mediafiles/components/mediafileuploader";
import {language} from "../../services/language.service";
import {take} from "rxjs/operators";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-richtext-editor",
    templateUrl: "./src/systemcomponents/templates/systemrichtexteditor.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemRichTextEditor),
            multi: true
        }, systemrichtextservice
    ]
})
export class SystemRichTextEditor implements OnInit, OnDestroy, ControlValueAccessor {

    /**
     * the editor container
     */
    @ViewChild('htmleditor', {read: ViewContainerRef, static: true}) private htmlEditor: ViewContainerRef;

    /**
     * set to true to have all options
     */
    @Input() private extendedmode: boolean = true;

    /**
     * an input to set the inner height of the editor window set in pixel
     * @private
     */
    @Input() private innerheight: string;

    /**
     * enable/disable using the media file module
     * @private
     */
    @Input() private useMedialFile: boolean = false;

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;
    private _html: string = '';

    private isActive: boolean = false;
    private clickListener: any;
    private keydownListener: any;
    private modalOpen: boolean = false;
    public isExpanded: boolean = false;

    private block: string = 'default';
    private fontName: string = 'Tilium Web';
    private fontSize: string = '5';
    private tagMap = {
        BLOCKQUOTE: "indent",
        A: "link"
    };

    @Output() private save$: EventEmitter<string> = new EventEmitter<string>();

    private select = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "DIV"];

    constructor(private modal: modal,
                private renderer: Renderer2,
                private metadata: metadata,
                private editorService: systemrichtextservice,
                @Inject(DOCUMENT) private _document: any,
                private elementRef: ElementRef,
                private language: language) {
    }

    get expandIcon() {
        return this.isExpanded ? 'contract_alt' : 'expand_alt';
    }

    /**
     * returns the inner height .. and if not set sets it to a default of 250
     */
    get innerHeight() {
        return this.innerheight ? this.innerheight : '250';
    }

    get richTextStyle() {
        return this.isExpanded ? {height: '100vh', resize: 'none', position: 'fixed'} : {height: (+this.innerHeight + 50) + 'px'};
    }

    public ngOnInit() {
        this.handleKeyboardShortcuts();
    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
        if (this.keydownListener) {
            this.keydownListener();
        }
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        this._html = value ? value : '';
        this.renderer.setProperty(this.htmlEditor.element.nativeElement, 'innerHTML', this._html);
    }

    /**
     * Executed command from editor header buttons
     * @param command string from triggerCommand
     */
    private executeCommand(command: string) {
        switch (command) {
            case 'openSourceEditor':
                this.openSourceEditor();
                break;
            case 'toggleFullscreen':
                this.isExpanded = !this.isExpanded;
                break;
            case 'openMediaFilePicker':
                this.openMediaFilePicker();
                break;
            case 'insertImage':
                this.insertImage();
                break;
            default:
                if (this.isActive && command != '') {
                    this.editorService.executeCommand(command);
                }
                this.exec();
                break;
        }
        return;
    }

    /**
     *  focus the text area when the editor is focussed
     */
    private onEditorClick(e) {
        // check if we are active already
        if (!this.isActive) {
            this.isActive = true;
            this.focusEditor();

            // listen to the click event if it is ousoide of the current elements scope
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
        }
        e.stopPropagation();
    }

    private onDocumentClick(event: MouseEvent) {
        if (!this.modalOpen && !this.elementRef.nativeElement.contains(event.target)) {
            this.isActive = false;
            this.clickListener();
        }
    }

    /**
     * Executed from the contenteditable section while the input property changes
     * @param html html string from contenteditable
     */
    private onContentChange(html: string): void {

        if (typeof this.onChange === 'function') {
            this.onChange(html);
        }

        this._html = html;
        return;
    }

    /**
     * toggles editor buttons when cursor moved or positioning
     *
     * Send a node array from the contentEditable of the editor
     */
    private exec() {
        let userSelection;
        if (window.getSelection) {
            userSelection = window.getSelection();
        }

        let a = userSelection.focusNode;
        const els = [];
        while (a && a.id !== 'editor') {
            els.unshift(a);
            a = a.parentNode;
        }

        // this.editorToolbar.triggerBlocks(els);
        this.triggerBlocks(els);
    }

    /**
     * handle inserting image from media file if active or from url directly
     */
    public insertImage() {
        this.editorService.saveSelection();
        this.modal.input(this.language.getLabel('LBL_IMAGE_LINK',this.language.getLabel('LBL_IMAGE')))
            .subscribe(url => {
                if (!url) return;
                this.focusEditor();
                this.editorService.restoreSelection();
                this.editorService.insertImage(url, this.htmlEditor.element.nativeElement);
                this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
            });
    }

    private openMediaFilePicker() {

        this.editorService.saveSelection();
        this.modalOpen = true;
        this.modal.openModal('MediaFilePicker').subscribe(componentRef => {
            componentRef.instance.answer.subscribe(image => {
                if (!image) {return;}
                if (image.upload) {
                    this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                        uploadComponentRef.instance.answer.subscribe(uploadimage => {
                            if (uploadimage) {
                                this.focusEditor();
                                this.editorService.restoreSelection();
                                this.editorService.insertImage('https://cdn.spicecrm.io/' + uploadimage, this.htmlEditor.element.nativeElement);
                                this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
                            }
                            this.modalOpen = false;
                        });
                    });
                } else {
                    if (image.id) {
                        this.focusEditor();
                        this.editorService.restoreSelection();
                        this.editorService.insertImage('https://cdn.spicecrm.io/' + image.id, this.htmlEditor.element.nativeElement);
                        this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
                    }
                    this.modalOpen = false;
                }
            });
        });
    }

    private openSourceEditor() {
        this.modal.openModal('SystemRichTextSourceModal').subscribe(componentRef => {
            componentRef.instance._html = this._html;
            componentRef.instance.html.subscribe(newHtml => {
                // update our internal value
                this._html = newHtml;

                // set the model value
                if (typeof this.onChange === 'function') {
                    this.onChange(newHtml);
                }

                // set the value to the editor
                this.renderer.setProperty(this.htmlEditor.element.nativeElement, 'innerHTML', this._html);
            });
        });
    }

    /*
     * for the toolbar
     */
    private commandIsActive(commandState) {
        // check the state
        return this.isActive && this._document.queryCommandState(commandState);
    }

    /**
     * trigger highlight editor buttons when cursor moved or positioning in block
     */
    private triggerBlocks(nodes: Node[]) {
        if (!this.isActive) {
            return;
        }

        let found = false;
        this.select.forEach(y => {
            const node = nodes.find(x => x.nodeName === y);
            if (node !== undefined && (y === node.nodeName || node.nodeName == 'code')) {
                if (found === false) {
                    this.block = node.nodeName.toLowerCase();
                    found = true;
                }
            } else if (found === false) {
                this.block = 'default';
            }
        });

        found = false;
    }

    /**
     * insert URL link
     */
    private insertUrl() {
        const url = prompt("Insert URL link", 'http:\/\/');
        if (url && url !== '' && url !== 'http://') {
            this.editorService.selectedText = this.getSelectedText();
            this.editorService.createLink(url);
        }
    }

    private addVideo() {
        if (!this.isActive) {return;}
        this.editorService.saveSelection();
        this.modal.input('Add Video','Inser Video URL').subscribe((url: string) => {
            if (!url || url.length == 0) return;
            this.focusEditor();
            this.editorService.restoreSelection();
            let vimeoReg = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
            let youtubeReg = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            if (url.match(vimeoReg)) {
                url = 'https://player.vimeo.com/video/' + url.match(vimeoReg)[3];
            }
            if (url.match(youtubeReg)) {
                url = 'https://www.youtube.com/embed/' + url.match(youtubeReg)[7];
            }
            let html = `<iframe src="${url}" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>`;
            this._document.execCommand('insertHTML', false, html);
        });
    }

    private getSelectedText(): string {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (this._document.selection && this._document.selection.type != "Control") {
            return this._document.selection.createRange().text;
        }
    }

    /** insert color */
    private insertColor(color: string, where: string) {
        this.editorService.insertColor(color, where);
        // this.execute.emit("");
    }

    /**
     * set font Name/family
     * @param fontName string
     */
    private setFontName(fontName: string): void {
        this.editorService.setFontName(fontName);
        // this.execute.emit("");
    }

    /**
     * set font Size
     * @param fontSize string
     *  */
    private setFontSize(fontSize: string): void {
        this.editorService.setFontSize(fontSize);
        // this.execute.emit("");
    }

    /**
     * Upload image when file is selected
     */
    private onFileChanged(event) {
        // to be implemented
    }

    private setCustomClass(classId: number) {
        // this.editorService.createCustomClass(this.customClasses[classId]);
    }

    private encodeHtml(value: string): string {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    private addCodeSnippet(): void {
        if (!this.isActive) {return;}
        let value = this.encodeHtml(this.getSelectedText()) || '&nbsp;';
        let html = `<br><pre style="background-color: #eee;border-radius: .2rem; border:1px solid #ccc; padding: .5rem"><code>${value}</code></pre><br>`;
        this._document.execCommand('insertHTML', false, html);
    }

    /**
     * paste a plain text when the caret is in a code tag.
     */
    private onPaste(e) {
        if (e.target.nodeName == 'CODE') {
            e.preventDefault();
            let text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand("insertHTML", false, this.encodeHtml(text));
        }
    }

    private handleKeyboardShortcuts() {
        this.keydownListener = this.renderer.listen('document', 'keydown', (e) => {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() == 's') {
                e.preventDefault();
                this.save$.emit(this._html);
            }
        });
    }

    private focusEditor() {
        this.htmlEditor.element.nativeElement.focus();
    }
}
