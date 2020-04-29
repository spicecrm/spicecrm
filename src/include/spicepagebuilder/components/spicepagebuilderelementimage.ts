/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, ImageI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-image',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementImage extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public element: ImageI;
    /**
     * interface attribute list for the element to loop through
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'border', type: ''},
        {name: 'border-top', type: ''},
        {name: 'border-right', type: ''},
        {name: 'border-bottom', type: ''},
        {name: 'border-left', type: ''},
        {name: 'border-radius', type: ''},
        {name: 'height', type: 'text'},
        {name: 'padding', type: 'sides'},
        {name: 'width', type: 'text'}
    ];

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    /**
     * open media file picker
     */
    private openMediaFilePicker() {
        this.spicePageBuilderService.openMediaFilePicker().subscribe(src => {
            if (!!src) {
                this.element.attributes.src = src;
            }
        });
    }
}
