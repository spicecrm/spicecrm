/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";

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
     * holds the drag entered value
     */
    private dragEntered: boolean = false;
    /**
     * read drop list dom element to be added to the group
     */
    @ViewChild('dropList', {read: CdkDropList, static: false}) private dropList: CdkDropList;

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * add drop list to group
     */
    public ngAfterViewInit() {
        this.spicePageBuilderService.addDropListToGroup(this.dropList);
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
    protected sectionPredicate(item: CdkDrag<any>) {
        return item.data.type == 'section';
    }

    /**
     * handle deleting section from container
     * @param section
     */
    private onSectionDelete(section) {
        this.container.sections = this.container.sections.filter(item => item != section);
    }

    /**
     * push the dropped item to the container array
     * @param event
     */
    private onDrop(event: CdkDragDrop<any>) {

        if (event.previousContainer != event.container) {
            // remove placeholder element
            if (this.spicePageBuilderService.dragPlaceholderNode && event.previousContainer.element.nativeElement.contains(this.spicePageBuilderService.dragPlaceholderNode)) {
                event.previousContainer.element.nativeElement.removeChild(this.spicePageBuilderService.dragPlaceholderNode);
                this.spicePageBuilderService.dragPlaceholderNode = undefined;
            }
            const section = JSON.parse(JSON.stringify(event.item.data));
            this.container.sections.splice(
                event.currentIndex, 0, section
            );
        } else {
            moveItemInArray(this.container.sections, event.previousIndex, event.currentIndex);

        }
    }
}
