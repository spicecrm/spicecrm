/**
 * @module ModuleSpicePageBuilder
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    Output
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {SpicePageBuilderRendererElement} from "./spicepagebuilderrendererelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-divider',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererdivider.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererDivider extends SpicePageBuilderRendererElement {

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }
}
