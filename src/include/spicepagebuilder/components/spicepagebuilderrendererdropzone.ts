/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-drop-zone',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererdropzone.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererDropZone {

    /**
     * hold the display label for the drop zone
     */
    @Input() protected readonly label: string = '';
    /**
     * hold the display icon for the drop zone
     */
    @Input() protected readonly icon: string;
    /**
     * emit when delete button clicked
     */
    @Output() private delete$: EventEmitter<void> = new EventEmitter();
}
