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
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, HTMLCodeI} from "../interfaces/spicepagebuilder.interfaces";
import {libloader} from "../../../services/libloader.service";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/** @ignore */
declare var html_beautify: any;

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-code',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementcode.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementCode extends SpicePageBuilderElement implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public element: HTMLCodeI;
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [];
    /**
     * is true when the beatify library is loaded
     */
    private beautifyLoaded: boolean = false;
    /**
     * hold the sanitized content html
     */
    private sanitizedContent: SafeHtml = '';

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                private libloader: libloader,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    /**
     * call to sanitize the html content
     */
    public ngOnInit() {
        super.ngOnInit();
        this.sanitizeContent();
        if (!!this.isEditMode) {
            this.loadBeatifyLibrary();
        }
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {
        this.element.content = res.content;
        this.sanitizeContent();
        super.handleEditResponse(res);
    }

    /**
     * load beatify library
     */
    private loadBeatifyLibrary() {
        this.libloader.loadLib('jsbeautify').subscribe(loaded => {
            this.beautifyLoaded = true;
            this.cdRef.detectChanges();
        });
    }

    /**
     * sanitize the html content
     */
    private sanitizeContent() {
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.element.content);
    }

    /**
     * beatify html code
     */
    private beautify() {
        this.element.content = html_beautify(this.element.content, {
            indent_size: 4,
            indent_char: " ",
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
        });
        this.cdRef.detectChanges();
    }
}
