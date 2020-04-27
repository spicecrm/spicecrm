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
    selector: 'spice-page-builder-renderer-spacer',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererspacer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererSpacer extends SpicePageBuilderRendererElement {

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }
}
