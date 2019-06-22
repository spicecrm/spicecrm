/**
 * @module SystemComponents
 */
import {Component, EventEmitter, OnInit, Renderer2, ViewChild} from '@angular/core';
import {language} from '../../services/language.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: "system-richtext-sourcemodal",
    templateUrl: "./src/systemcomponents/templates/systemrichtextsourcemodal.html",
})
export class SystemRichTextSourceModal implements OnInit {

    public self: any = {};
    private _html: string = '';
    private searchtext: string = '';
    private foundIndices: number[] = [];
    private currentIndex: number = -1;
    private html: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('sourceeditor', {static: true}) private sourceEditor: any;

    constructor(private language: language, private renderer: Renderer2, public sanitized: DomSanitizer) {
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
    }

    private keyUp(e): void {
        if (e.which == 13 || e.keyCode == 13 && this.searchText.length > 0) {
            this.currentIndex = 0;
            this.selectFoundText();
        }
    }

    private findTextIndices(searchText: string, text: string): void {
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

    private getTextNodesIn(node: Node): any[] {
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

    private selectFoundText(): void {
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

    private nextResult() {
        if (this.currentIndex < this.foundIndices.length) {
            this.currentIndex++;
            this.selectFoundText();
        }
    }

    private previewResult() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectFoundText();
        }
    }

    private onContentChange(html) {
        this._html = html;
    }

    private close() {
        this.html.emit(this._html);
        this.self.destroy();
    }
}
