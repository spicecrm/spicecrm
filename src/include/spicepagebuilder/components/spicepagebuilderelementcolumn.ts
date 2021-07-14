/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementcolumn.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementColumn implements OnInit, AfterViewInit {
    /**
     * containers to be rendered
     */
    @Input() protected readonly column: ColumnI;
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

    constructor(private spicePageBuilderService: SpicePageBuilderService,
                private modal: modal,
                private cdRef: ChangeDetectorRef) {
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
    protected trackByFn(index, item) {
        return index;
    }

    /** Predicate method that only allows sections to be dropped into a list. */
    protected contentPredicate(item: CdkDrag) {
        return item.data.tagName != 'section';
    }

    /**
     * generate body style object
     */
    private generateStyle() {
        this.style = {
            'background-color': this.column.attributes['background-color'],
            'border': this.column.attributes.border,
            'border-top': this.column.attributes['border-top'],
            'border-right': this.column.attributes['border-right'],
            'border-bottom': this.column.attributes['border-bottom'],
            'border-left': this.column.attributes['border-left'],
            'border-radius': this.column.attributes['border-radius'],
            'width': this.column.attributes.width,
            'vertical-align': this.column.attributes['vertical-align'],
            'padding': this.column.attributes.padding,
        };
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
                event.previousContainer.data.children = event.previousContainer.data.children.filter(item => item != event.item.data);
            }

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
                        }
                    });
                    break;
                default:
                    const element: PanelElementI = JSON.parse(JSON.stringify(event.item.data));
                    delete element.icon;

                    this.column.children.splice(
                        event.currentIndex, 0, element
                    );
            }
        } else {
            moveItemInArray(this.column.children, event.previousIndex, event.currentIndex);
        }
        this.dragEntered = false;
    }

    /**
     * emit drag exited to parent
     * @param event
     */
    private onDragExit(event: CdkDragExit) {
        this.dragEntered = false;
    }

    /**
     * remove placeholder element if exists
     * @param event
     */
    private onDragEnter(event: CdkDragEnter) {
        this.dragEntered = true;
    }

    /**
     * delete the content element from the column
     * @param element
     */
    private onContentDelete(element) {
        this.column.children = this.column.children.filter(item => item != element);
    }
}
