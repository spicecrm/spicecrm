/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDrag, CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

/**
 * Parse and renders the html page design
 */
@Component({
    selector: 'spice-page-builder-renderer',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRenderer {

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
}
