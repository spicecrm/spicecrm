/**
 * @module ModuleSpicePageBuilder
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {modal} from "../../../services/modal.service";
import {ColumnI, PanelElementI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-column',
    templateUrl: '../templates/spicepagebuilderelementcolumn.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementColumn implements OnInit, AfterViewInit {
    /**
     * containers to be rendered
     */
    @Input() public readonly column: ColumnI;
    /**
     * holds the drag entered value
     */
    public dragEntered: boolean = false;
    /**
     * read drop list dom element to be added to the group
     */
    @ViewChild('dropList', {read: CdkDropList, static: false}) public dropList: CdkDropList;
    /**
     * hold the style object for the element
     */
    public style = {};

    constructor(public spicePageBuilderService: SpicePageBuilderService,
                public modal: modal,
                public cdRef: ChangeDetectorRef) {
    }

    /**
     * call to generate body style from attributes
     */
    public ngOnInit() {
        this.generateStyle();
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
    public trackByFn(index, item) {
        return index;
    }

    /** Predicate method that only allows sections to be dropped into a list. */
    public contentPredicate(item: CdkDrag) {
        return item.data.tagName != 'section';
    }

    get displayStyle(){
        this.generateStyle();
        return this.style;
    }

    /**
     * generate body style object
     */
    public generateStyle() {
        this.style = {};
        if(this.column.attributes['background-color']) this.style['background-color'] = this.column.attributes['background-color'];
        if(this.column.attributes['border']) this.style['border'] = this.column.attributes['border'];
        if(this.column.attributes['border-top']) this.style['border-top'] = this.column.attributes['border-top'];
        if(this.column.attributes['border-right']) this.style['border-right'] = this.column.attributes['border-right'];
        if(this.column.attributes['border-bottom']) this.style['border-bottom'] = this.column.attributes['border-bottom'];
        if(this.column.attributes['border-left']) this.style['border-left'] = this.column.attributes['border-left'];
        // border radius is not supported on the table element
        // if(this.column.attributes['border-radius']) this.style['border-radius'] = this.column.attributes['border-radius'];
        if(this.column.attributes['vertical-align']) this.style['vertical-align'] = this.column.attributes['vertical-align'];
        if(this.column.attributes['padding']) this.style['padding'] = this.column.attributes['padding'];
    }

    /**
     * push the dropped item to the container array
     * @param event
     */
    public onDrop(event: CdkDragDrop<any>) {

        if (event.previousContainer != event.container) {
            // remove placeholder element
            if (this.spicePageBuilderService.dragPlaceholderNode && event.previousContainer.element.nativeElement.contains(this.spicePageBuilderService.dragPlaceholderNode)) {
                event.previousContainer.element.nativeElement.removeChild(this.spicePageBuilderService.dragPlaceholderNode);
                this.spicePageBuilderService.dragPlaceholderNode = undefined;
            }

            // remove the item if it comes from a sibling list
            if (event.previousContainer.id.indexOf('panel-drop-list') == -1) {
                event.previousContainer.data.children = event.previousContainer.data.children.filter(item => item != event.item.data);
            }

            this.spicePageBuilderService.isMouseIn = undefined;

            switch (event.item.data.tagName) {
                case 'image':
                    this.spicePageBuilderService.openMediaFilePicker().subscribe(src => {
                        if (!!src) {
                            const image: PanelElementI = JSON.parse(JSON.stringify(event.item.data));
                            image.attributes.src = src;
                            delete image.icon;
                            this.column.children.splice(
                                event.currentIndex, 0, image
                            );
                            this.cdRef.detectChanges();
                            this.spicePageBuilderService.emitData();
                        }
                    });
                    break;
                case 'social':

                    const social: PanelElementI = JSON.parse(JSON.stringify(event.item.data));

                    this.spicePageBuilderService.openEditModal(social).subscribe(socialRes => {
                        this.column.children.splice(
                            event.currentIndex, 0, socialRes
                        );
                        this.cdRef.detectChanges();
                        this.spicePageBuilderService.emitData();
                    });
                    break;
                default:
                    const element: PanelElementI = JSON.parse(JSON.stringify(event.item.data));
                    delete element.icon;

                    this.column.children.splice(
                        event.currentIndex, 0, element
                    );
                    this.spicePageBuilderService.emitData();
            }
        } else {
            moveItemInArray(this.column.children, event.previousIndex, event.currentIndex);
            this.spicePageBuilderService.emitData();
        }

        this.dragEntered = false;
    }

    /**
     * emit drag exited to parent
     * @param event
     */
    public onDragExit(event: CdkDragExit) {
        this.dragEntered = false;
    }

    /**
     * remove placeholder element if exists
     * @param event
     */
    public onDragEnter(event: CdkDragEnter) {
        this.dragEntered = true;
    }

    /**
     * delete the content element from the column
     * @param element
     */
    public onContentDelete(element) {
        this.column.children = this.column.children.filter(item => item != element);
        this.spicePageBuilderService.emitData();
    }
}
