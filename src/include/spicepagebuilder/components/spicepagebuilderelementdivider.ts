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
    templateUrl: '../templates/spicepagebuilderelementdivider.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementDivider extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public element: DividerI;
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'container-background-color', type: 'color'},
        {name: 'border-style', type: 'text'},
        {name: 'padding', type: 'sides'},
        {name: 'width', type: 'textSuffix'},
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
     * generate body style object
     */
    public generateStyle() {
        super.generateStyle([
            'border-color', 'border-style', 'border-width'
        ]);
    }
}
