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

