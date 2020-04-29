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
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementButton extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public element: ButtonI;
    /**
     * interface attribute list for the element to loop through
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'width', type: 'text'},
        {name: 'border-color', type: 'color'},
        {name: 'border-style', type: ''},
        {name: 'border-width', type: 'text'},
        {name: 'height', type: 'text'},
        {name: 'padding', type: 'sides'},
        {name: 'text-align', type: ''},
        {name: 'vertical-align', type: ''},
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
}
