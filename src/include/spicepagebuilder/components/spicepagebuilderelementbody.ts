/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {BodyI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * Parse and renders renderer body
 */
@Component({
    selector: 'spice-page-builder-element-body',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementbody.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementBody implements OnInit, AfterViewInit {
    /**
     * body to be rendered
     */
    @Input() protected readonly body: BodyI;
    /**
     * holds the drag entered value
     */
    private dragEntered: boolean = false;
    /**
     * read drop list dom element to be added to the group
     */
    @ViewChild('dropList', {read: CdkDropList, static: false}) private dropList: CdkDropList;
    /**
     * hold the style object for the element
     */
    private style = {};

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to generate body style from attributes
     */
    public ngOnInit() {
        this.generateStyle();
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
        return item.data.tagName == 'section';
    }

    /**
     * generate body style object
     */
    private generateStyle() {
        this.style = {
            'background-color': this.body.attributes['background-color'],
            'width': this.body.attributes.width
        };
    }

    /**
     * handle deleting section from body
     * @param section
     */
    private onSectionDelete(section) {
        this.body.children = this.body.children.filter(item => item != section);
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
            this.body.children.splice(
                event.currentIndex, 0, section
            );
            this.dragEntered = false;
        } else {
            moveItemInArray(this.body.children, event.previousIndex, event.currentIndex);
        }
    }
}
