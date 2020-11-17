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

    // for the value accessor
    private onChange: (value: string) => void;
    private onTouched: () => void;
    private _html: string = '';

    private isActive: boolean = false;
    private clickListener: any;
    private keydownListener: any;
    private modalOpen: boolean = false;
    public isExpanded: boolean = false;
    public contract: EventEmitter<string> = new EventEmitter<string>();
    public editorModalSaveSubscriber: any;

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
    get innerHeight(){
        return this.innerheight ? this.innerheight : '250';
    }

    private getRichTextStyle(container) {
        return this.isExpanded ? {height: `calc(100vh - ${container.offsetTop}px)`, resize: "none"} : {height: this.innerHeight + 'px'};
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
            case 'openEditorModal':
                this.openEditorModal();
                break;
            case 'openMediaFilePicker':
                this.openMediaFilePicker();
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

    /** Workflow:
     * - Toggle the expand variable value.
     * - If isExpanded is True:
     *      -- A new instance of this component will be added to the footer through the "SystemRichTextEditorModal" component.
     *      -- The html value will be passed to the footer instance of this component.
     *      -- A subscriber subscribe to the emitter (contract) from the new footer instance of this component to get back the html value and set isExpanded to false and destroy the instance in the footer.
     * - If isExpanded is False:
     *      -- the emitter (contract) from the new footer instance of this component will emit the html value to set it back to this component.
     */
    private openEditorModal() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.modal.openModal('SystemRichTextEditorModal').subscribe(componentRef => {
                this.editorModalSaveSubscriber = componentRef.instance.save$
                    .subscribe(content => this.save$.emit(content));
                componentRef.instance.content = this._html;
                componentRef.instance.contract
                    .pipe(take(1))
                    .subscribe(html => {
                        this.isExpanded = false;
                        this.focusEditor();
                        this.writeValue(html);
                        this.onChange(html);
                        if (this.editorModalSaveSubscriber) this.editorModalSaveSubscriber.unsubscribe();
                    });
            });
        } else {
            this.contract.emit(this._html);
        }
    }

    private openMediaFilePicker() {
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
                                this.editorService.insertImage('https://cdn.spicecrm.io/' + uploadimage);
                            }
                            this.modalOpen = false;
                        });
                    });
                } else {
                    if (image.id) {
                        this.focusEditor();
                        this.editorService.restoreSelection();
                        this.editorService.insertImage('https://cdn.spicecrm.io/' + image.id);
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
