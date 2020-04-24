/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-image',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererImage {
    /**
     * containers to be rendered
     */
    @Input() protected readonly image: { type: 'image', style, src };
    /**
     * emit when delete button clicked
     */
    @Output() private delete$: EventEmitter<void> = new EventEmitter();

    constructor(private domSanitizer: DomSanitizer, private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * set the hovered element level
     * @param value
     */
    private setIsMouseIn(value) {
        this.spicePageBuilderService.isMouseIn = value ? 'content' : 'section';
    }

    /**
     * set the current editing element
     */
    private edit() {
        this.spicePageBuilderService.editingElement = this.image;
    }
}
