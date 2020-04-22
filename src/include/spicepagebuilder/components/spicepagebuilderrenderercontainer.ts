/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-container',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderercontainer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererContainer implements AfterViewInit {
    /**
     * containers to be rendered
     */
    @Input() protected readonly container: { type, sections, style };
    /**
     * emit after view init
     */
    @Output() private domRendered$: EventEmitter<void> = new EventEmitter();

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    public ngAfterViewInit() {
        this.domRendered$.emit();
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

    /**
     * handle deleting section from container
     * @param section
     */
    private onSectionDelete(section) {
        this.container.sections = this.container.sections.filter(item => item != section);

    }
}
