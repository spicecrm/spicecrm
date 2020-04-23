/**
 * @module ModuleSAPIDOCs
 */
import {AfterViewInit, Component, Input, Renderer2, ViewChild} from '@angular/core';
import {modellist} from "../../../services/modellist.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {libloader} from "../../../services/libloader.service";
import {ActivatedRoute} from "@angular/router";

declare var html_beautify: any;

@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocsviewer.html'
})
export class SAPIDOCsViewer implements AfterViewInit{

    private self: any;

    private xml: string;

    constructor(private metadata: metadata, private modellist: modellist, private model: model, private libloader: libloader, private renderer: Renderer2) {

    }

    public ngAfterViewInit(): void {
        this.libloader.loadLib('jsbeautify').subscribe(loaded => {
            this.xml = html_beautify(this.model.getField('idoc'), {
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
            });
        });
    }

    private close() {
        this.self.destroy();
    }

}

