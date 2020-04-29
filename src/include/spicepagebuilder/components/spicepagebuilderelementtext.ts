/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, TextI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-text',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementtext.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementText extends SpicePageBuilderElement implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public element: TextI;
    /**
     * interface attribute list for the element to loop through
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'color', type: 'color'},
        {name: 'background-color', type: 'color'},
        {name: 'font-family', type: ''},
        {name: 'font-size', type: ''},
        {name: 'font-style', type: ''},
        {name: 'font-weight', type: ''},
        {name: 'line-height', type: ''},
        {name: 'letter-spacing', type: ''},
        {name: 'height', type: 'text'},
        {name: 'text-decoration', type: ''},
        {name: 'text-transform', type: ''},
        {name: 'align', type: ''},
        {name: 'padding', type: 'sides'},
    ];
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
     * handle edit changes
     * @param res
     */
    public handleEditResponse(res) {
        this.element.content = res.content;
        this.sanitizeContent();
        super.handleEditResponse(res);
    }

    /**
     * sanitize the html content
     */
    private sanitizeContent() {
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.element.content);
    }
}
