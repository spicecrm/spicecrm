/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {modal} from "../../../services/modal.service";
import {Observable, Subject} from "rxjs";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-column',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderercolumn.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererColumn implements AfterViewInit {
    /**
     * holds the drag entered value
     */
    private dragEntered: boolean = false;
    /**
     * containers to be rendered
     */
    @Input() protected readonly column: { type, elements, style };
    /**
     * read drop list dom element to be added to the group
     */
    @ViewChild('dropList', {read: CdkDropList, static: false}) private dropList: CdkDropList;

    constructor(private spicePageBuilderService: SpicePageBuilderService,
                private modal: modal,
                private cdRef: ChangeDetectorRef) {
    }

    public ngAfterViewInit(): void {
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
    protected contentPredicate(item: CdkDrag) {
        return item.data.type != 'section';
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

            // remove the item if it comes from a sibling list
            if (event.previousContainer.id.indexOf('panel-drop-list') == -1) {
                event.previousContainer.data.elements = event.previousContainer.data.elements.filter(item => item != event.item.data);
            }

            switch (event.item.data.type) {
                case 'image':
                    this.spicePageBuilderService.openMediaFilePicker().subscribe(src => {
                        if (!!src) {
                            const image = {...event.item.data};
                            image.src = src;
                            event.container.data.elements.push(image);
                            this.cdRef.detectChanges();
                        }
                    });
                    break;
                default:
                    event.container.data.elements.push(
                        JSON.parse(JSON.stringify(event.item.data))
                    );
            }
        } else {
            moveItemInArray(event.container.data.elements, event.previousIndex, event.currentIndex);
        }
        this.dragEntered = false;
    }

    /**
     * emit drag exited to parent
     * @param event
     */
    private onDragExit(event: CdkDragExit) {
       /* const placeholderNode: any = event.item.getPlaceholderElement().cloneNode(true);
        this.spicePageBuilderService.dragPlaceholderNode = placeholderNode;
        event.container.element.nativeElement.insertBefore(placeholderNode, event.item.getPlaceholderElement());
      */  this.dragEntered = false;
    }

    /**
     * remove placeholder element if exists
     * @param event
     */
    private onDragEnter(event: CdkDragEnter) {
      /*  if (this.spicePageBuilderService.dragPlaceholderNode && event.container.element.nativeElement.contains(this.spicePageBuilderService.dragPlaceholderNode)) {
            event.container.element.nativeElement.removeChild(this.spicePageBuilderService.dragPlaceholderNode);
            this.spicePageBuilderService.dragPlaceholderNode = undefined;
        }
     */   this.dragEntered = true;
    }

    /**
     * delete the content element from the column
     * @param element
     */
    private onContentDelete(element) {
        this.column.elements = this.column.elements.filter(item => item != element);
    }
}
