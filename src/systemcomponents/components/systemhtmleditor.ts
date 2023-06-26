/**
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {
    Component,
    ComponentRef,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DOCUMENT} from "@angular/common";

import {modal} from "../../services/modal.service";
import {systemrichtextservice} from "../services/systemrichtext.service";
import {language} from "../../services/language.service";
import {take} from "rxjs/operators";
import {metadata} from "../../services/metadata.service";
import {model} from '../../services/model.service';
import {helper} from '../../services/helper.service';
import {configurationService} from "../../services/configuration.service";
import {SystemRichTextLink} from "./systemrichtextlink";

@Component({
    selector: "system-html-editor",
    templateUrl: "../templates/systemhtmleditor.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemHtmlEditor),
            multi: true
        }, systemrichtextservice
    ]
})
export class SystemHtmlEditor implements OnInit, OnDestroy, ControlValueAccessor {

    /**
     * the editor container
     */
    @ViewChild('htmleditor', {read: ViewContainerRef, static: true}) public htmlEditor: ViewContainerRef;

    /**
     * set to true to have all options
     */
    @Input() public extendedmode: boolean = true;

    /**
     * an input to set the inner height of the editor window set in pixel
     * @private
     */
    @Input() public innerheight: string;

    /**
     * enable/disable using the media file module
     * @private
     */
    @Input() public useMedialFile: boolean = false;
    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;
    public _html: string = '';
    public isActive: boolean = false;
    public clickListener: any;
    public keydownListener: any;
    public modalOpen: boolean = false;
    public isExpanded: boolean = false;
    public block: string = 'default';
    public fontName: string = 'Tilium Web';
    public fontSize: string = '5';
    public tagMap = {
        BLOCKQUOTE: "indent",
        A: "link"
    };
    @Output() public save$: EventEmitter<string> = new EventEmitter<string>();
    public select = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "DIV"];

    constructor(public modal: modal,
                public renderer: Renderer2,
                public metadata: metadata,
                public editorService: systemrichtextservice,
                @Inject(DOCUMENT) public _document: any,
                public elementRef: ElementRef,
                public language: language,
                public viewContainerRef: ViewContainerRef,
                public configurationService: configurationService,
                @Optional() public model: model,
                public helper: helper) {
    }

    public get useTemplateVariableHelper() {
        return (this.model?.module === 'LandingPages' || this.model?.module === 'OutputTemplates' || this.model?.module === 'EmailTemplates' || this.model?.module === 'CampaignTasks');
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
        return this.isExpanded ? {
            height: '100vh',
            resize: 'none',
            position: 'fixed'
        } : {height: (+this.innerHeight + 50) + 'px'};
    }

    public ngOnInit() {
        this.handleKeyboardShortcuts();
        this.editorService.editorContainer = this.htmlEditor.element.nativeElement;
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
    public executeCommand(command: string) {
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
            case 'openTemplateVariableHelper':
                this.openTemplateVariableHelper();
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
    public onEditorClick(e) {
        // check if we are active already
        if (!this.isActive) {
            this.isActive = true;
            this.focusEditor();

            // listen to the click event if it is ousoide of the current elements scope
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
        }
        e.stopPropagation();
    }

    public onDocumentClick(event: MouseEvent) {
        if (!this.modalOpen && !this.elementRef.nativeElement.contains(event.target)) {
            this.isActive = false;
            this.clickListener();
        }
    }

    /**
     * Executed from the contenteditable section while the input property changes
     * @param html html string from contenteditable
     */
    public onContentChange(html: string): void {

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
    public exec() {
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
        this.modal.input(this.language.getLabel('LBL_IMAGE_LINK', this.language.getLabel('LBL_IMAGE')))
            .pipe(take(1))
            .subscribe(url => {
                if (!url) return;
                this.focusEditor();
                this.editorService.restoreSelection();
                this.editorService.insertImage(url, this.htmlEditor.element.nativeElement);
                this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
            });
    }

    public openMediaFilePicker() {

        this.editorService.saveSelection();
        this.modalOpen = true;
        this.modal.openModal('MediaFilePicker')
            .pipe(take(1))
            .subscribe(componentRef => {
                componentRef.instance.answer.subscribe(image => {
                    if (!image) {
                        return;
                    }
                    if (image.upload) {
                        this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                            uploadComponentRef.instance.answer.subscribe(uploadimage => {
                                if (uploadimage) {
                                    const mediaFileConfig: {
                                        public_url: string
                                    } = this.configurationService.getCapabilityConfig('mediafiles');
                                    this.focusEditor();
                                    this.editorService.restoreSelection();
                                    this.editorService.insertImage(mediaFileConfig.public_url + uploadimage, this.htmlEditor.element.nativeElement);
                                    this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
                                }
                                this.modalOpen = false;
                            });
                        });
                    } else {
                        if (image.id) {
                            const mediaFileConfig: {
                                public_url: string
                            } = this.configurationService.getCapabilityConfig('mediafiles');
                            this.focusEditor();
                            this.editorService.restoreSelection();
                            this.editorService.insertImage(mediaFileConfig.public_url + image.id, this.htmlEditor.element.nativeElement);
                            this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
                        }
                        this.modalOpen = false;
                    }
                });
            });
    }

    public openSourceEditor() {
        this.modal.openModal('SystemRichTextSourceModal', true, this.viewContainerRef.injector)
            .pipe(take(1))
            .subscribe(componentRef => {
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
    public commandIsActive(commandState) {
        // check the state
        return this.isActive && this._document.queryCommandState(commandState);
    }

    /**
     * trigger highlight editor buttons when cursor moved or positioning in block
     */
    public triggerBlocks(nodes: Node[]) {
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
     * Insert or edit anchor (link)
     */
    public insertAnchor() {
        this.editorService.selectedText = this.getSelectedText();
        this.editorService.saveSelection();
        let aTag: HTMLAnchorElement = null;
        if (this.editorService.savedSelectionParentElement.nodeName === 'A') aTag = (this.editorService.savedSelectionParentElement as HTMLAnchorElement);
        else aTag = this.editorService.savedSelectionParentElement.closest('a');
        this.modal.openModal('SystemRichTextLink', true)
            .subscribe((modalRef: ComponentRef<SystemRichTextLink>) => {
                modalRef.instance.text = aTag?.text ?? this.editorService.selectedText;
                modalRef.instance.parent = this.model;
                modalRef.instance.editorService = this.editorService;
                if (aTag) {
                    modalRef.instance.alterMode = true;
                    modalRef.instance.url = aTag.href;
                    modalRef.instance.trackingId = aTag.dataset.trackinglink;
                    modalRef.instance.trackByMethod = !!aTag.dataset.trackinglink ? 'id' : ('trackinglink' in aTag.dataset) ? 'url' : undefined;
                    modalRef.instance.marketingAction = aTag.dataset.marketingaction;
                }
                modalRef.instance.response
                    .subscribe({
                        next: anchorData => {
                            if (anchorData) {
                                if (aTag) {
                                    aTag.href = anchorData.url;
                                    if (anchorData.linkType === 'conv' && !!anchorData.trackByMethod) aTag.dataset.trackinglink = anchorData.trackingId;
                                    else delete aTag.dataset.trackinglink;
                                    if (anchorData.marketingAction) aTag.dataset.marketingaction = anchorData.marketingAction;
                                    else delete aTag.dataset.marketingaction;
                                } else {
                                    if (!anchorData.text) anchorData.text = anchorData.url;
                                    this.editorService.restoreSelection();
                                    let linkContent = anchorData.text;
                                    if (this.editorService.selectedText === anchorData.text) linkContent = this.editorService.selectedHtml;
                                    let dataAttributes: any = {};
                                    if (anchorData.linkType === 'conv' && !!anchorData.trackByMethod) dataAttributes.trackinglink = anchorData.trackingId;
                                    if (anchorData.linkType === 'mark') dataAttributes.marketingaction = anchorData.marketingAction;
                                    this.editorService.insertAnchor(anchorData.url, linkContent, dataAttributes);
                                }
                                this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
                            }
                        }
                    });
            });
    }

    /**
     * Remove anchor (link)
     */
    public removeAnchor() {
        this.editorService.selectedText = this.getSelectedText();
        this.editorService.saveSelection();
        let aTag: HTMLAnchorElement;
        if (this.editorService.savedSelectionParentElement.nodeName === 'A') aTag = (this.editorService.savedSelectionParentElement as HTMLAnchorElement);
        else aTag = this.editorService.savedSelectionParentElement.closest('a');
        if (aTag) {
            aTag.outerHTML = aTag.innerHTML;
            this.onContentChange(this.htmlEditor.element.nativeElement.innerHTML);
        }
    }

    public addVideo() {
        if (!this.isActive) {
            return;
        }
        this.editorService.saveSelection();
        this.modal.input('Add Video', 'Insert Video URL')
            .pipe(take(1))
            .subscribe((url: string) => {
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

    public getSelectedText(): string {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (this._document.selection && this._document.selection.type != "Control") {
            return this._document.selection.createRange().text;
        }
    }

    /** insert color */
    public insertColor(color: string, where: string) {
        this.editorService.insertColor(color, where);
        // this.execute.emit("");
    }

    /**
     * set font Name/family
     * @param fontName string
     */
    public setFontName(fontName: string): void {
        this.editorService.setFontName(fontName);
        // this.execute.emit("");
    }

    /**
     * set font Size
     * @param fontSize string
     *  */
    public setFontSize(fontSize: string): void {
        this.editorService.setFontSize(fontSize);
        // this.execute.emit("");
    }

    /**
     * Upload image when file is selected
     */
    public onFileChanged(event) {
        // to be implemented
    }

    public setCustomClass(classId: number) {
        // this.editorService.createCustomClass(this.customClasses[classId]);
    }

    public encodeHtml(value: string): string {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    public addCodeSnippet(): void {
        if (!this.isActive) {
            return;
        }
        let value = this.encodeHtml(this.getSelectedText()) || '&nbsp;';
        let html = `<br><pre style="background-color: #eee;border-radius: .2rem; border:1px solid #ccc; padding: .5rem"><code>${value}</code></pre><br>`;
        this._document.execCommand('insertHTML', false, html);
    }

    /**
     * paste a plain text when the caret is in a code tag.
     */
    public onPaste(e) {
        if (e.target.nodeName == 'CODE') {
            e.preventDefault();
            let text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand("insertHTML", false, this.encodeHtml(text));
        }
    }

    public handleKeyboardShortcuts() {
        this.keydownListener = this.renderer.listen('document', 'keydown', (e) => {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() == 's') {
                e.preventDefault();
                this.save$.emit(this._html);
            }
        });
    }

    public focusEditor() {
        this.htmlEditor.element.nativeElement.focus();
    }

    public openTemplateVariableHelper() {
        if (!this.isActive) {
            return;
        }
        this.editorService.saveSelection();
        this.modalOpen = true;
        this.modal.openModal('OutputTemplatesVariableHelper', null, this.viewContainerRef.injector)
            .pipe(take(1))
            .subscribe(modal => {
                modal.instance.response
                    .pipe(take(1))
                    .subscribe(text => {
                        this.focusEditor();
                        this.editorService.restoreSelection();
                        this._document.execCommand('insertText', false, '{' + text + '}');
                        this.modalOpen = false;
                    });
            });
    }

    public getHtmlFromSelection() {
        let range;
        let userSelection = window.getSelection();
        // Get the range:
        if (userSelection.getRangeAt) range = userSelection.getRangeAt(0);
        else {
            range = document.createRange();
            range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
            range.setEnd(userSelection.focusNode, userSelection.focusOffset);
        }
        // And the HTML:
        let clonedSelection = range.cloneContents();
        let div = document.createElement('div');
        div.appendChild(clonedSelection);
        return div.innerHTML;
    }

}
