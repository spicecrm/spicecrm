/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDrag, CdkDragDrop, CdkDragEnter, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
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
                    this.openMediaFilePicker().subscribe(src => {
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
                        {...event.item.data}
                    );
            }
        } else {
            moveItemInArray(event.container.data.sections, event.previousIndex, event.currentIndex);
        }
        this.dragEntered = false;
    }

    /**
     * open media file picker modal and return the src of the image
     * @return src: string
     */
    private openMediaFilePicker(): Observable<string> {

        const response: Subject<string> = new Subject();

        this.modal.openModal('MediaFilePicker').subscribe(componentRef => {
            componentRef.instance.answer.subscribe(image => {

                if (!image) {
                    response.next(undefined);
                    response.complete();
                }

                if (image.upload) {
                    this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                        uploadComponentRef.instance.answer.subscribe(uploadimage => {
                            response.next(!uploadimage ? undefined : 'https://cdn.spicecrm.io/' + uploadimage);
                            response.complete();
                        });
                    });
                } else {
                    response.next(!image.id ? undefined : 'https://cdn.spicecrm.io/' + image.id);
                    response.complete();
                }
            });
        });

        return response.asObservable();
    }

    /**
     * delete the content element from the column
     * @param element
     */
    private onContentDelete(element) {
        this.column.elements = this.column.elements.filter(item => item != element);
    }
}
