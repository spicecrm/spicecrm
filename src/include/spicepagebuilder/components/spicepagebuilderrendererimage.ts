/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {SpicePageBuilderRendererElement} from "./spicepagebuilderrendererelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-image',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererImage extends SpicePageBuilderRendererElement {

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    /**
     * handle edit changes
     * @param res
     */
    public handleEditResponse(res) {
        this.element.src = res.src;
        super.handleEditResponse(res);
    }
}
