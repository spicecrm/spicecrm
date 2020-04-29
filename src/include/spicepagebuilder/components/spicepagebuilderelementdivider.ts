/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, DividerI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-divider',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementdivider.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementDivider extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public element: DividerI;
    /**
     * interface attribute list for the element to loop through
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'width', type: 'text'},
        {name: 'border-top-style', type: ''}
    ];

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    /**
     * @return divider margin top
     */
    get dividerSpacing(): string {
        return this.element.attributes['margin-top'];
    }

    /**
     * set divider spacing
     * @param value
     */
    set dividerSpacing(value: string) {
        this.element.attributes['margin-top'] = value;
        this.element.attributes['padding-top'] = value;
    }
}
