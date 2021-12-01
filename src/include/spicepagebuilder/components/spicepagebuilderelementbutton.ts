/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, ButtonI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-button',
    templateUrl: '../templates/spicepagebuilderelementbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementButton extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public element: ButtonI;
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'href', type: 'text'},
        {name: 'rel', type: 'text'},
        {name: 'target', type: 'text'},
        {name: 'align', type: 'text'},
        {name: 'width', type: 'textSuffix'},
        {name: 'container-background-color', type: 'color'},
        {name: 'border', type: 'text'},
        {name: 'border-top', type: 'text'},
        {name: 'border-right', type: 'text'},
        {name: 'border-bottom', type: 'text'},
        {name: 'border-left', type: 'text'},
        {name: 'height', type: 'textSuffix'},
        {name: 'padding', type: 'sides'},
        {name: 'inner-padding', type: 'sides'},
        {name: 'line-height', type: 'textSuffix'},
        {name: 'vertical-align', type: 'text'},
        {name: 'font-size', type: 'textSuffix'},
        {name: 'font-style', type: 'text'},
        {name: 'font-weight', type: 'text'},
        {name: 'letter-spacing', type: 'textSuffix'},
        {name: 'text-decoration', type: 'text'},
        {name: 'text-transform', type: 'text'},
        {name: 'css-class', type: 'text'}
    ];

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {
        this.element.content = res.content;
        super.handleEditResponse(res);
    }

    /**
     * generate body style object
     */
    public generateStyle() {
        super.generateStyle([
            'width', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius',
            'height', 'line-height', 'vertical-align', 'font-size', 'font-style', 'font-weight', 'text-align',
            'letter-spacing', 'text-decoration', 'text-transform', 'background-color', 'align', 'color'
        ]);
    }
}
