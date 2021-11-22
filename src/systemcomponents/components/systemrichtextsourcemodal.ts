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
 * @module SystemComponents
 */
import {Component, EventEmitter, OnInit, Renderer2, ViewChild} from '@angular/core';
import {language} from '../../services/language.service';
import {libloader} from '../../services/libloader.service';
import {DomSanitizer} from '@angular/platform-browser';

declare var html_beautify: any;

@Component({
    selector: "system-richtext-sourcemodal",
    templateUrl: "./src/systemcomponents/templates/systemrichtextsourcemodal.html",
})
export class SystemRichTextSourceModal implements OnInit {

    public self: any = {};
    public _html: string = '';
    public searchtext: string = '';
    private foundIndices: number[] = [];
    private currentIndex: number = -1;
    private html: EventEmitter<string> = new EventEmitter<string>();

    private beautifyenabled: boolean = false;

    @ViewChild('sourceeditor', {static: true}) public sourceEditor: any;

    constructor(public language: language, public renderer: Renderer2, public sanitized: DomSanitizer, private libloader: libloader) {
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

    private beautify() {
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
