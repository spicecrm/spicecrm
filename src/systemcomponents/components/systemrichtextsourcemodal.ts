/**
 * @module SystemComponents
 */
import {
    Component,
    EventEmitter,
    Inject,
    Injector,
    OnDestroy,
    OnInit,
    Optional,
    Renderer2,
    ViewChild
} from '@angular/core';
import {language} from '../../services/language.service';
import {libloader} from '../../services/libloader.service';
import {DomSanitizer} from '@angular/platform-browser';
import { model } from '../../services/model.service';
import { take } from 'rxjs/operators';
import { systemrichtextservice } from '../services/systemrichtext.service';
import { modal } from '../../services/modal.service';
import { DOCUMENT } from '@angular/common';

declare var html_beautify: any;
declare var _: any;

@Component({
    selector: "system-richtext-sourcemodal",
    templateUrl: "../templates/systemrichtextsourcemodal.html",
    providers: [ systemrichtextservice ]
})
export class SystemRichTextSourceModal implements OnInit, OnDestroy {

    public self: any = {};
    public _html: string = '';
    public searchtext: string = '';
    public foundIndices: number[] = [];
    public currentIndex: number = -1;
    public html: EventEmitter<string> = new EventEmitter<string>();
    public isUserInsideEditor = false;
    public editorId = _.uniqueId();
    public eventListener: any[] = [];
    public beautifyenabled: boolean = false;

    @ViewChild('sourceeditor', {static: true}) public sourceEditor: any;

    constructor(
        public language: language, public renderer: Renderer2, public sanitized: DomSanitizer,
        public libloader: libloader, public injector: Injector, @Optional() public model: model,
        public modal: modal, public editorService: systemrichtextservice, @Inject(DOCUMENT) public _document: any ) {
        this.libloader.loadLib('jsbeautify').subscribe(loaded => {
            this.beautifyenabled = true;
        });

    }

    get nextDisabled() {
        return this.currentIndex == (this.foundIndices.length -1);
    }

    get previewDisabled() {
        return this.currentIndex == 0;
    }

    get searchText() {
        return this.searchtext;
    }

    set searchText(val: string) {
        this.currentIndex = 0;
        this.searchtext = val;
    }

    get sanitizedHtml() {
        return this.sanitized.bypassSecurityTrustHtml(this._html);
    }

    public ngOnInit() {
        this.renderer.setProperty(this.sourceEditor.nativeElement, 'innerText', this._html);
        this.eventListener.push( this.renderer.listen('document', 'click', () => this.isUserInsideEditor = this.testIsUserInsideEditor() ));
        this.eventListener.push( this.renderer.listen('document', 'keyup', () => {
            this.isUserInsideEditor = this.testIsUserInsideEditor();
            return true;
        }));
    }

    public keyUp(e): void {
        if (e.which == 13 || e.keyCode == 13 && this.searchText.length > 0) {
            this.currentIndex = 0;
            this.selectFoundText();
        }
    }

    public findTextIndices(searchText: string, text: string): void {
        this.foundIndices = [];
        searchText = searchText.toLowerCase();
        let startIndex = 0;
        let index;
        while (startIndex < text.length) {
            index = text.indexOf(searchText, startIndex);
            if (index > -1) {
                this.foundIndices.push(index);
                startIndex = index + searchText.length;
            } else {
                break;
            }
        }
    }

    public getTextNodesIn(node: Node): any[] {
        let textNodes = [];
        let isTextNode = node.nodeType == 3;
        if (isTextNode) {
            textNodes.push(node);
        } else {
            let children = node.childNodes;
            children.forEach((child, i) => textNodes.concat(this.getTextNodesIn(children[i])));
            for (let i = 0, len = children.length; i < len; ++i) {
                textNodes.push.apply(textNodes, this.getTextNodesIn(children[i]));
            }
        }
        return textNodes;
    }

    public selectFoundText(): void {
        let sourceEditor = this.sourceEditor.nativeElement;

        if (document.createRange && window.getSelection) {
            let range = document.createRange();
            range.selectNodeContents(sourceEditor);
            let textNodes = this.getTextNodesIn(sourceEditor);
            this.findTextIndices(this.searchText, textNodes.map(n => n.data).join(''));
            let start = this.foundIndices[this.currentIndex];
            let end = start + this.searchText.length;
            let startChar = 0;
            textNodes.some(node => {
                let endChar = startChar + node.length;
                if (start < endChar && end > startChar) {
                    range.setStart(node, start - startChar);
                    range.setEnd(node, end - startChar);
                    return true;
                }
                startChar = startChar + node.length;
            });
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.hasOwnProperty('selection') && document.body.hasOwnProperty('createTextRange')) {
            let docBody: any = document.body;
            let textRange = docBody.createTextRange();
            textRange.moveToElementText(sourceEditor);
            textRange.collapse(true);
            this.findTextIndices(this.searchText, this._html);
            let start = this.foundIndices[this.currentIndex];
            let end = start + this.searchText.length;
            textRange.moveEnd("character", end);
            textRange.moveStart("character", start);
            textRange.select();
        }
    }

    public beautify() {
        this.renderer.setProperty(this.sourceEditor.nativeElement, 'innerText', html_beautify(this.sourceEditor.nativeElement.innerText, {
            indent_size: 4,
            indent_char:  " ",
            indent_with_tabs: false,
            end_with_newline: false,
            indent_level: 0,
            preserve_newlines: true,
            max_preserve_newlines: 10,
            space_in_paren: false,
            space_in_empty_paren: false,
            unindent_chained_methods: false,
            break_chained_methods: false,
            keep_array_indentation: false,
            unescape_strings: false,
            wrap_line_length: 100,
            e4x: false,
            comma_first: false,
            operator_position: "before-newline",
            indent_empty_lines: false,
            templating: ["auto"]
        }));
    }

    public nextResult() {
        if (this.currentIndex < this.foundIndices.length) {
            this.currentIndex++;
            this.selectFoundText();
        }
    }

    public previewResult() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectFoundText();
        }
    }

    public onContentChange(html) {
        this._html = html;
    }

    public close() {
        this.html.emit(this._html);
        this.self.destroy();
    }

    /**
     * Should the TemplateVariableHelper be offered, the button enabled?
     */
    public get useTemplateVariableHelper() {
        return ( this.model?.module === 'OutputTemplates' || this.model?.module === 'EmailTemplates' || this.model?.module === 'CampaignTasks' );
    }

    /**
     * Open the modal with the TemplateVariableHelper
     */
    public openTemplateVariableHelper() {
        this.editorService.saveSelection();
        this.modal.openModal('OutputTemplatesVariableHelper', null, this.injector )
            .pipe(take(1))
            .subscribe(modal => {
                modal.instance.response
                    .pipe(take(1))
                    .subscribe( text => {
                        this.focusEditor();
                        this.editorService.restoreSelection();
                        this._document.execCommand('insertText', false, '{'+text+'}' );
                    });
            });
    }

    public focusEditor() {
        this.sourceEditor.nativeElement.focus();
    }

    /**
     * Determine if the user "is" currently inside the editor.
     */
    public testIsUserInsideEditor(): boolean {
        if ( window.getSelection ) {
            let userSelection = window.getSelection();
            let a: any = userSelection.focusNode;
            while( a && a.id !== this.editorId && a.parentNode ) a = a.parentNode;
            return a?.id === this.editorId;
        } else return false;
    }

    public ngOnDestroy() {
        this.eventListener.forEach( item => item() );
    }

    public onModalEscX() {
        this.close();
    }

}
