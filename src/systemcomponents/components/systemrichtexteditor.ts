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
    Input,
    NgZone,
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
import {libloader} from "../../services/libloader.service";
import {DomSanitizer} from "@angular/platform-browser";
import * as less from 'less'
import {configurationService} from "../../services/configuration.service";

declare var ClassicEditor;

@Component({
    selector: "system-richtext-editor",
    templateUrl: "../templates/systemrichtexteditor.html",
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
    @ViewChild('ckEditor', {read: ViewContainerRef, static: true}) public ckEditor: ViewContainerRef;

    /**
     * set to true to have all options
     */
    @Input() public extendedmode: boolean = true;

    /**
     * display the editor in read only mode
     * @private
     */
    @Input() public readOnly: boolean = false;

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

    /**
     * the id of the stylesheet to apply
     * @private
     */
    @Input() private stylesheetId: string;

    public get useTemplateVariableHelper() {
        return this.model?.module in {OutputTemplates: true, EmailTemplates: true, CampaignTasks: true,LandingPages: true,}
    }

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;
    public _html: string = '';

    public isActive: boolean = false;
    public isShow: boolean = false;
    public clickListener: any;
    public keydownListener: any;
    public modalOpen: boolean = false;
    public isExpanded: boolean = false;
    public selectedColumn: number;
    public selectedRow: number;

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
                private libLoader: libloader,
                public metadata: metadata,
                public editorService: systemrichtextservice,
                @Inject(DOCUMENT) public _document: any,
                public elementRef: ElementRef,
                public language: language,
                private zone: NgZone,
                private sanitizer: DomSanitizer,
                public viewContainerRef: ViewContainerRef,
                public configurationService: configurationService,
                @Optional() public model: model,
                public helper: helper ) {
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
        return this.isExpanded ? {height: '100vh', resize: 'none', position: 'fixed'} : {height: (+this.innerHeight + (this.readOnly ? 0 : 50)) + 'px'};
    }

    /**
     * holds a reference to the ckeditor
     * @private
     */
    public editor: {execute: (command: string, params?: any) => void, setData: (data: string) => void, getData: () => string, model: any, ui: any, editing: any, enableReadOnlyMode: (val: string) => void};

    public customStyleDefinitions: { id: string, display: string, classes: string[], element: string }[] = [];

    public ngOnInit() {

        this.loadCustomStyleDefinitions();

        this.libLoader.loadLib('ckeditor').subscribe(res => {
            this.zone.runOutsideAngular(() => {

                ClassicEditor.create(this.ckEditor.element.nativeElement, {
                    removePlugins: ['Markdown','Title'],
                    style: {
                        definitions: this.customStyleDefinitions.map(s => ({
                            name: s.id,
                            element: s.element,
                            classes: s.classes
                        }))
                    },
                    image: {
                        styles: [
                            'alignCenter',
                            'alignLeft',
                            'alignRight'
                        ],
                        resizeOptions: [
                            {
                                name: 'resizeImage:original',
                                label: 'Original size',
                                value: null
                            },
                            {
                                name: 'resizeImage:50',
                                label: '50%',
                                value: '50'
                            },
                            {
                                name: 'resizeImage:75',
                                label: '75%',
                                value: '75'
                            }
                        ],
                        toolbar: [ // 'toggleImageCaption'
                            'imageTextAlternative', '|',
                            'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', 'imageStyle:side', '|',
                            'resizeImage'
                        ]
                    },
                    toolbar: [],
                    htmlSupport: {
                        allow: this.generateHtmlTagsAllowAttributes(['div', 'img', 'span', 'table', 'p', 'h1', 'h2', 'h3', 'h4', 'input', 'fieldset', 'button', 'label', 'textarea', 'select', 'option', 'optgroup'])
                        // hr
                    },
                    autosave: {
                        save: ( editor ) => {
                            return this.onChange( editor.getData() );
                        }
                    },
                }).then(res => {
                    this.editor = res;
                    if (this.readOnly) {
                        this.editor.enableReadOnlyMode('efsjeflksjefloikjse');
                    }
                    this.editor.editing.view.change(writer=>{
                        writer.setStyle('height', '100%', this.editor.editing.view.document.getRoot());
                    });
                    this.editor.setData(this._html);

                });
            });

        });
        this.handleKeyboardShortcuts();
    }

    /**
     * load custom style definitions
     * @private
     */
    private loadCustomStyleDefinitions() {
        if(this.stylesheetId){
            this.metadata.getHtmlFormats( this.stylesheetId ).forEach( format => {
                this.customStyleDefinitions.push({
                    display: format.name,
                    id: format.id,
                    classes: format.classes ? format.classes.trim().split(/\s+/) : [],
                    element: format.block ? format.block : ( format.inline ? format.inline : '' )
                })
            });
        }
    }

    /**
     * generate html tags allow spice custom attribute
     * @param tags
     * @protected
     */
    protected generateHtmlTagsAllowAttributes(tags: string[]) {
        return tags.map(tag => {

            return {
                name: tag,
                attributes: {
                    'data-trackinglink': true,
                    'data-marketingaction': true,
                    'data-spicefor': true,
                    'data-spiceif': true,
                    'data-spicefor-first': true,
                    'data-spicefor-last': true,
                    'data-spicetemplate': true,
                    'data-signature': true,
                    'data-spice-reply-quote': true,
                    'data-spice-temp-quote': true,
                    'class': true,
                    'style': true,
                    'value': true,
                    'type': true,
                    'id': true,
                    'name': true,
                    'for': true,
                    'checked': true,
                    'selected': true,
                    'size': true,
                    'autocomplete': true,
                    'autofocus': true,
                    'placeholder': true,
                    'max': true,
                    'maxlength': true,
                    'min': true,
                    'minlength': true,
                    'multiple': true,
                    'required': true,
                    'disabled': true,
                    'form': true,
                    'step': true,
                    'readonly': true,
                    'cols': true,
                    'rows': true,
                    'wrap': true,
                    'label': true,
                    'width': true,
                    'height': true
                }
            }
        });
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
        if (this.editor) {
            this.editor.setData(value);
        }
    }

    /**
     * Executed command from editor header buttons
     * @param command string from triggerCommand
     */
    public executeCommand(command: string) {

        if (!this.isActive || !command) return;

        this.editor.execute(command);
    }

    /**
     * toggle fullscreen
     */
    public toggleFullscreen() {
        this.isExpanded = !this.isExpanded;
    }

    /**
     *
     * execute headings
     */
    public heading(command: string){
        this.editor.execute('heading', {value: command});
    }

    /**
     *
     * execute custom style
     */
    public customStyle(name: string){
        if ( name ) this.editor.execute('style', name);
    }
    /**
     *
     *  table modal
     */
    public  openTable() {
        this.isShow = !this.isShow;
        this.selectedColumn = this.selectedRow = 0;
    }

    /**
     *
     * selecting row and column
     */
    public selectTable(row,column) {
        this.selectedColumn = column;
        this.selectedRow = row;
    }

    /**
     * inserting table
     */
    public insertTable(){
        this.editor.execute('insertTable', { rows: this.selectedRow, columns: this.selectedColumn })
        this.isShow = false;
    }

    public cancelTable(){
        this.isShow = false;
    }

    /**
     *
     * execute alignment
     */
    public alignment(command: string) {
        this.editor.execute('alignment', {value: command});
    }

    /**
     *  focus the text area when the editor is focussed
     */
    public onEditorClick(e) {
        // check if we are active already
        if (!this.isActive) {
            this.isActive = true;

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
        this.modal.input(this.language.getLabel('LBL_IMAGE_LINK',this.language.getLabel('LBL_IMAGE')))
            .subscribe(url => {
                if (!url) return;
                this.editor.execute('imageInsert', {source: [{src: url}]});
            });
    }

    public openMediaFilePicker() {

        this.modalOpen = true;
        this.modal.openModal('MediaFilePicker')
            .subscribe(componentRef => {
                componentRef.instance.answer.subscribe(image => {

                    if (!image) return;

                    const mediaFileConfig: {public_url: string} = this.configurationService.getCapabilityConfig('mediafiles');

                    if (image.upload) {
                        this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                            uploadComponentRef.instance.answer.subscribe(uploadimage => {
                                if (uploadimage) {
                                    this.editor.execute('imageInsert', {source: [{src: mediaFileConfig.public_url + uploadimage}]});
                                }
                                this.modalOpen = false;
                            });
                        });
                    } else {
                        if (image.id) {
                            this.editor.execute('imageInsert', {source: [{src: mediaFileConfig.public_url + image.id}]});
                        }
                        this.modalOpen = false;
                    }
                });
            });
    }

    public openSourceEditor() {
        this.modal.openModal('SystemRichTextSourceModal', true, this.viewContainerRef.injector )
            .pipe(take(1))
            .subscribe(componentRef => {
                componentRef.instance._html = this.editor.getData();
                componentRef.instance.html.subscribe(newHtml => {
                    // update our internal value
                    this._html = newHtml;
                    this.editor.setData(newHtml);

                    // set the model value
                    if (typeof this.onChange === 'function') {
                        this.onChange(newHtml);
                    }
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
     * Insert Link
     */
    public insertLink() {
        this.modal.input('', 'LBL_ADD_LINK')
            .subscribe(linkData => {
                if (!linkData) return;

                this.editor.execute('link', linkData);
            });
    }

    /**
     * add video
     */
    public addVideo() {

        if (!this.isActive) return;

        this.modal.input('', 'LBL_ADD_VIDEO')
            .subscribe((url: string) => {

                if (!url) return;

                this.editor.execute('mediaEmbed', url);
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

    /**
     * add code snippet
     */
    public addCodeSnippet(): void {

        if (!this.isActive) return;

        const options = [
            { value: 'plaintext', display: 'Plain text' },
            { value: 'c', display: 'C' },
            { value: 'cs', display: 'C#' },
            { value: 'cpp', display: 'C++' },
            { value: 'css', display: 'CSS' },
            { value: 'diff', display: 'Diff' },
            { value: 'html', display: 'HTML' },
            { value: 'java', display: 'Java' },
            { value: 'javascript', display: 'JavaScript' },
            { value: 'php', display: 'PHP' },
            { value: 'python', display: 'Python' },
            { value: 'ruby', display: 'Ruby' },
            { value: 'typescript', display: 'TypeScript' },
            { value: 'xml', display: 'XML' }
        ];

        this.modal.prompt('input', '', 'LBL_SELECT_LANGUAGE', 'shade', undefined, options, true).subscribe(res => {
            if (!res) return;
            this.editor.execute( 'codeBlock', { language: res, forceValue: true } );
        })

        // todo check html
        // let value = this.encodeHtml(this.getSelectedText()) || '&nbsp;';
        // let html = `<br><pre style="background-color: #eee;border-radius: .2rem; border:1px solid #ccc; padding: .5rem"><code>${value}</code></pre><br>`;

    }

    public handleKeyboardShortcuts() {
        this.keydownListener = this.renderer.listen('document', 'keydown', (e) => {
            if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() == 's') {
                e.preventDefault();
                this.save$.emit(this._html);
            }
        });
    }


    public openTemplateVariableHelper() {

        if (!this.isActive) return;

        this.modalOpen = true;

        this.modal.openModal('OutputTemplatesVariableHelper', null, this.viewContainerRef.injector )
            .subscribe(modal => {
                modal.instance.response
                    .pipe(take(1))
                    .subscribe( text => {
                        this.modalOpen = false;

                        this.editor.model.change(writer => {
                            this.editor.model.insertContent( writer.createText( `{${text}}` ) );
                        });
                    });
            });
    }

    public getHtmlFromSelection() {
        let range;
        let userSelection = window.getSelection();
        // Get the range:
        if (userSelection.getRangeAt) range = userSelection.getRangeAt (0);
        else {
            range = document.createRange();
            range.setStart( userSelection.anchorNode, userSelection.anchorOffset );
            range.setEnd( userSelection.focusNode, userSelection.focusOffset );
        }
        // And the HTML:
        let clonedSelection = range.cloneContents();
        let div = document.createElement( 'div' );
        div.appendChild( clonedSelection );
        return div.innerHTML;
    }

    /**
     * emit save event with the editor data
     */
    public save() {
        this.save$.emit(this.editor.getData());
    }

    /**
     * holds the css content to be applied
     */
    public cssContent;

    /**
     * set the css content from the css input to be used in a link tag
     * @param val
     */
    @Input()
    set css(val) {

        if (!val) return;

        less.render(`.slds-rich-text-editor__textarea {${val}}`).then(res =>
            this.cssContent = this.sanitizer.bypassSecurityTrustResourceUrl('data:text/css;base64,' + btoa(res.css))
        );
    }
}
