/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, HostListener, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-text',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderertext.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererText implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() protected readonly text: { type: 'text', style, content };
    /**
     * hold the sanitized content html
     */
    private sanitizedContent: SafeHtml = '';
    /**
     * save show drop zone boolean
     */
    private showDropZone: boolean = false;

    constructor(private domSanitizer: DomSanitizer,
    ) {
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
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.text.content);
    }

    @HostListener('mouseenter')
    private onMouseEnter() {
        this.showDropZone = true;
    }
    @HostListener('mouseleave')
    private onMouseLeave() {
        this.showDropZone = false;
    }
}
