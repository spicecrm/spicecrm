/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {SpicePageBuilderRendererElement} from "./spicepagebuilderrendererelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-code',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderercode.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererCode extends SpicePageBuilderRendererElement implements OnInit {
    /**
     * hold the sanitized content html
     */
    private sanitizedContent: SafeHtml = '';

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    /**
     * call to sanitize the html content
     */
    public ngOnInit() {
        this.sanitizeContent();
    }

    /**
     * sanitize the html content
     */
    private sanitizeContent() {
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.element.content);
    }
}
