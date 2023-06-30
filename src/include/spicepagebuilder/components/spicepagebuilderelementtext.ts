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
    templateUrl: '../templates/spicepagebuilderelementtext.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementText extends SpicePageBuilderElement implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public declare element: TextI;
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'color', type: 'color'},
        {name: 'container-background-color', type: 'color'},
        {name: 'font-size', type: 'textSuffix'},
        {name: 'font-style', type: 'text'},
        {name: 'font-weight', type: 'text'},
        {name: 'line-height', type: 'textSuffix'},
        {name: 'letter-spacing', type: 'textSuffix'},
        {name: 'height', type: 'textSuffix'},
        {name: 'text-decoration', type: 'text'},
        {name: 'text-transform', type: 'text'},
        {name: 'align', type: 'text'},
        {name: 'padding', type: 'sides'},
        {name: 'css-class', type: 'text'}
    ];
    /**
     * hold the sanitized content html
     */
    public sanitizedContent: SafeHtml = '';

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
        super.ngOnInit();
        if (!this.element.editorType) {
            this.element.editorType = 'richText';
        }
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
    public sanitizeContent() {
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.element.content);
    }

    /**
     * generate body style object
     */
    public generateStyle() {
        super.generateStyle([
            'color', 'font-size', 'font-style', 'font-weight', 'line-height', 'letter-spacing',
            'text-decoration', 'text-transform', 'align', 'padding', 'height'
        ]);
    }
}
