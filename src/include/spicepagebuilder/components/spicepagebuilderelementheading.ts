/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AttributeObjectI, TextI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElementText} from "./spicepagebuilderelementtext";
import {style} from "@angular/animations";

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