/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-section',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderersection.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererSection {
    /**
     * containers to be rendered
     */
    @Input() protected readonly section: { type, columns, style };
    /**
     * save show drop zone boolean
     */
    private showDropZone: boolean = false;
    /**
     * emit when delete button clicked
     */
    @Output() private delete$: EventEmitter<void> = new EventEmitter();

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return index;
    }

    @HostListener('mouseenter')
    private onMouseEnter() {
        this.showDropZone = true;
    }

    @HostListener('mouseleave')
    private onMouseLeave() {
        this.showDropZone = false;
    }
}
