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
    selector: 'sap-idcos-viewer',
    templateUrl: '../templates/sapidocsviewer.html'
})
export class SAPIDOCsViewer implements AfterViewInit {

    /**
     * reference to self as the modal
     */
    public self: any;

    /**
     * the xml string to be rendered
     */
    public xml: string;

    /**
     * indicator when an idoc is beoing processed
     */
    public processing: boolean = false;

    constructor(public backend: backend, public metadata: metadata, public toast: toast, public modellist: modellist, public model: model, public libloader: libloader, public renderer: Renderer2) {
        this.formatIdoc();
    }


    public ngAfterViewInit(): void {

    }

    /**
     * loads the formatter and formats the idoc
     */
    public formatIdoc() {
        this.libloader.loadLib('jsbeautify').subscribe(loaded => {
            this.xml = html_beautify(this.decodeHTMLEntities(this.model.getField('idoc')), {
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

    private decodeHTMLEntities(text) {
        var entities = [
            ['amp', '&'],
            ['apos', '\''],
            ['#x27', '\''],
            ['#x2F', '/'],
            ['#39', '\''],
            ['#47', '/'],
            ['lt', '<'],
            ['gt', '>'],
            ['nbsp', ' '],
            ['quot', '"']
        ];

        for (var i = 0, max = entities.length; i < max; ++i) {
            text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
        }

        return text;
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * processes the idoc
     */
    public processIDOC() {
        this.processing = true;
        this.backend.postRequest(`module/SAPIdocs/${this.model.id}/process`).subscribe(
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

