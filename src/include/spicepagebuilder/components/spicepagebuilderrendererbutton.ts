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
    selector: 'spice-page-builder-renderer-button',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererButton extends SpicePageBuilderRendererElement {

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
        this.element.url = res.url;
        this.element.text = res.text;
        super.handleEditResponse(res);
    }
}
