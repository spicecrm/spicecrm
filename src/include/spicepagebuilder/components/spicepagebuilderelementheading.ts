/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AttributeObjectI, TextI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElementText} from "./spicepagebuilderelementtext";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'spice-page-builder-element-heading',
    templateUrl: '../templates/spicepagebuilderelementheading.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpicePageBuilderElementHeading extends SpicePageBuilderElementText {
    /**
     * containers to be rendered
     */
    @Input() public declare element: TextI;
    /**
     * list of the editable attributes
     */
    public readonly mainAattributesList: AttributeObjectI[][] = [
        [
            {name: 'font-size', type: 'textSuffix'},
            {name: 'line-height', type: 'textSuffix'},
            {name: 'font-style', type: 'fontstyle'},
            {name: 'font-weight', type: 'fontweight'},
            {name: 'text-decoration', type: 'textdecoration'},
            {name: 'text-transform', type: 'texttransform'},
            {name: 'color', type: 'color'},
            {name: 'align', type: 'halign'}
        ]
    ];
    public readonly attributesList: AttributeObjectI[][] = [
        [
            {name: 'container-background-color', type: 'color'},
            {name: 'letter-spacing', type: 'textSuffix'},
            {name: 'height', type: 'textSuffix'},
            {name: 'align', type: 'halign'},
            {name: 'padding', type: 'sides'},
            {name: 'css-class', type: 'text'}
        ]
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
        this.growEditorModal = false;
    }

    public ngOnInit() {
        super.ngOnInit();
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

    public updateStyleForPreview(attribute) {
        this.style = {...this.style, [attribute]: this.element.attributes[attribute]};
    }

    /**
     * sanitize the html content
     */
    public sanitizeContent() {
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.element.content);
    }

    public toggleFontWeight() {
        this.element.attributes["font-weight"] = this.element.attributes["font-weight"] === '600' ? '400' : '600';
        this.updateStyleForPreview("font-weight");
    }

    public toggleFontStyleItalic() {
        this.element.attributes["font-style"] = this.element.attributes["font-style"] === 'italic' ? 'normal' : 'italic';
        this.updateStyleForPreview("font-style")
    }

    public toggleFontStyleUnderline() {
        this.element.attributes["text-decoration"] = this.element.attributes["text-decoration"] === 'underline' ? 'none' : 'underline';
        this.updateStyleForPreview("text-decoration");
    }

    public changeFontSize(fontSize) {
        this.element.attributes["font-size"] = fontSize;
        this.updateStyleForPreview("font-size");
    }
}