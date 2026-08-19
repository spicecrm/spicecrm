/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectorRef, Component, Injector, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-attributes',
    templateUrl: '../templates/spicepagebuilderelementattributes.html',
    standalone: false
})
export class SpicePageBuilderElementAttributes  {
    /**
     * containers to be rendered
     */
    @Input() public declare element: any;
    /**
     * list of the editable attributes
     */
    @Input()public attributesList: Array<Array<AttributeObjectI>> = [];

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {

    }

}
