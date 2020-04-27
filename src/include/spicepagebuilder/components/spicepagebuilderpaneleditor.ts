/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {libloader} from "../../../services/libloader.service";

/** @ignore */
declare var _;
/** @ignore */
declare var html_beautify: any;

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-panel-editor',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderpaneleditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderPanelEditor implements OnInit {
    /**
     * code container reference to beatify
     */
    @ViewChild('codeContainer', {read: ViewContainerRef, static: false}) private codeContainer: ViewContainerRef;
    /**
     * hold the element to be edited
     */
    public element: any = {};
    /**
     * emit the changes to the element
     */
    public response: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /**
     * is true when the beatify library is loaded
     */
    public beautifyLoaded: boolean = false;
    /**
     * holds a reference to the component for destroy
     */
    public self: any = {};
    /**
     * align radio options
     */
    public alignArray: any[] = [

    ];

    constructor(private spicePageBuilderService: SpicePageBuilderService,
                private cdRef: ChangeDetectorRef,
                private libloader: libloader) {
    }

    /**
     * set divider spacing
     * @param value
     */
    set dividerSpacing(value) {
        this.element.style['margin-top'] = value;
        this.element.style['padding-top'] = value;
    }

    /**
     * @return divider margin top
     */
    get dividerSpacing() {
        return this.element.style['margin-top'];
    }

    /**
     * call to load beatify library
     */
    public ngOnInit(): void {
        this.loadBeatifyLibrary();
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
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return index;
    }

    /**
     * close the modal and pass false for no changes
     */
    private cancel() {
        this.response.next(false);
        this.response.complete();
        this.self.destroy();
    }

    /**
     * close the modal and emit response true for the element
     */
    private confirm() {
        this.response.next(JSON.parse(JSON.stringify(this.element)));
        this.response.complete();
        this.self.destroy();
    }

    private openMediaFilePicker() {
        this.spicePageBuilderService.openMediaFilePicker().subscribe(src => {
            if (!!src) {
                this.element.src = src;
            }
        });
    }

    /**
     * beatify html code
     */
    private beautify() {
        this.element.content = html_beautify(this.element.content, {
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
        this.cdRef.detectChanges();
    }
}
