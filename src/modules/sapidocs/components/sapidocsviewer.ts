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
 * @module ModuleSAPIDOCs
 */
import {AfterViewInit, Component, Input, Renderer2, ViewChild} from '@angular/core';
import {modellist} from "../../../services/modellist.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {libloader} from "../../../services/libloader.service";

declare var html_beautify: any;

/**
 * a modal that displays an IDOC formatted properly and allows reprocessing the IDOC
 */
@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocsviewer.html'
})
export class SAPIDOCsViewer implements AfterViewInit {

    /**
     * reference to self as the modal
     */
    private self: any;

    /**
     * the xml string to be rendered
     */
    private xml: string;

    /**
     * indicator when an idoc is beoing processed
     */
    private processing: boolean = false;

    constructor(private backend: backend, private metadata: metadata, private toast: toast, private modellist: modellist, private model: model, private libloader: libloader, private renderer: Renderer2) {
        this.formatIdoc();
    }


    public ngAfterViewInit(): void {

    }

    /**
     * loads the formatter and formats the idoc
     */
    private formatIdoc() {
        this.libloader.loadLib('jsbeautify').subscribe(loaded => {
            this.xml = html_beautify(this.model.getField('idoc'), {
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
        });
    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * processes the idoc
     */
    private processIDOC() {
        this.processing = true;
        this.backend.postRequest(`modules/SAPIdocs/${this.model.id}/process`).subscribe(
            success => {
                this.processing = false;
                this.toast.sendToast('IDOC processed', 'info');
            },
            error => {
                this.processing = false;
                this.toast.sendToast('IDOC not processed', 'error');
            });
    }

}

