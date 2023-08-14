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
    templateUrl: '../templates/spicepagebuilderelementcode.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementCode extends SpicePageBuilderElement implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public declare element: HTMLCodeI;
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [];
    /**
     * is true when the beatify library is loaded
     */
    public beautifyLoaded: boolean = false;
    /**
     * hold the sanitized content html
     */
    public sanitizedContent: SafeHtml = '';

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public libloader: libloader,
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
    public loadBeatifyLibrary() {
        this.libloader.loadLib('jsbeautify').subscribe(loaded => {
            this.beautifyLoaded = true;
            this.cdRef.detectChanges();
        });
    }

    /**
     * sanitize the html content
     */
    public sanitizeContent() {
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.element.content);
    }

    /**
     * beatify html code
     */
    public beautify() {
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
