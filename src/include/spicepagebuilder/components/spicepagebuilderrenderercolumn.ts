/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-column',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderercolumn.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererColumn implements AfterViewInit {
    @ViewChild('dropList', {read: CdkDropList, static: false}) private dropList: CdkDropList;
    /**
     * containers to be rendered
     */
    @Input() protected readonly column: { type, elements, style };

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    public ngAfterViewInit(): void {
        if (!this.spicePageBuilderService.dropListGroup._items.has(this.dropList)) {
            this.spicePageBuilderService.dropListGroup._items.add(this.dropList);
        }
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

    /** Predicate method that only allows sections to be dropped into a list. */
    protected contentPredicate(item: CdkDrag) {
        return item.data.type != 'section';
    }

    /**
     * push the dropped item to the container array
     * @param event
     */
    private onDrop(event: CdkDragDrop<any>) {

        if (event.previousContainer != event.container) {
            event.container.data.push(
                {...event.item.data}
            );
        }
    }
}
