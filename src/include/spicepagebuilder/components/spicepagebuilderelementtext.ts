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
    public readonly attributesList: AttributeObjectI[][] = [
        [
            {name: 'color', type: 'color'},
            {name: 'container-background-color', type: 'color'}
        ], [
            {name: 'font-size', type: 'textSuffix', class:'slds-size--1-of-3'},
            {name: 'font-style', type: 'text', class:'slds-size--1-of-3'},
            {name: 'font-weight', type: 'text', class:'slds-size--1-of-3'}
        ], [
            {name: 'line-height', type: 'textSuffix'},
            {name: 'letter-spacing', type: 'textSuffix'},
            {name: 'height', type: 'textSuffix'},
            {name: 'text-decoration', type: 'textdecoration'},
            {name: 'text-transform', type: 'text'},
            {name: 'align', type: 'halign'},
            {name: 'padding', type: 'sides'},
            {name: 'css-class', type: 'text'}]
    ];
    /**
     * hold the sanitized content html
     */
    public sanitizedContent: SafeHtml = '';

    /**
     * holds the info if the styles panel is expanded
     */
    public styleExpanded: boolean = false;

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
        if (!this.element.attributes["editor-type"]) {
            this.element.attributes["editor-type"] = 'richText';
        }
        this.sanitizeContent();
    }

    get editorStyle() {
        if (this.styleExpanded) {
            return {
                height: '50%'
            }
        } else {
            return {
                height: 'calc(100% - 40px)'
            }
        }
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
            'text-decoration', 'text-transform', 'padding', 'height'
        ]);

        if(this.element.attributes.align){
            this.style['text-align'] = this.element.attributes.align;
        }
    }
}
