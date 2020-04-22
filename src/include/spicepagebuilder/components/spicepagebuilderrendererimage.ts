/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

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
}
