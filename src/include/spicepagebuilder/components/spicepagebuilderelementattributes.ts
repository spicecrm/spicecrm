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
    selector: 'spice-page-builder-element-attributes',
    templateUrl: '../templates/spicepagebuilderelementattributes.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementAttributes  {
    /**
     * containers to be rendered
     */
    @Input() public declare element: any;
    /**
     * list of the editable attributes
     */
    @Input()public readonly attributesList: Array<Array<AttributeObjectI>> = [];

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {

    }

}
