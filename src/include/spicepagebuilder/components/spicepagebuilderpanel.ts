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
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDragEnter, CdkDragExit} from "@angular/cdk/drag-drop";
import {ColumnI, SectionI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-panel',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderpanel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderPanel {
    /**
     * reference of the parent to allow destroy
     * @private
     */
    @Input() private self: any;
    /**
     * available sections
     */
    protected sections: SectionI[] = [];

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to generate sections
     */
    public ngOnInit() {
        this.generateSections();
    }

    /**
     * generate sections
     */
    protected generateSections() {

        let counterSection = 1;

        while (counterSection <= 4) {
            let counterColumn = 1;
            let columns: ColumnI[] = [];

            while (counterColumn <= counterSection) {
                columns.push(
                    JSON.parse(JSON.stringify(this.spicePageBuilderService.panelDefaultColumn))
                );
                counterColumn++;
            }
            const section: SectionI = JSON.parse(JSON.stringify(this.spicePageBuilderService.panelDefaultSection));
            section.children = columns;
            this.sections.push(section);
            counterSection++;
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

    /**
     * Predicate function that doesn't allow items to be dropped into a list.
     */
    protected noReturnPredicate() {
        return false;
    }

    /**
     * emit drag exited to parent
     * @param event
     */
    private onDragExit(event: CdkDragExit) {
        const placeholderNode: any = event.item.getPlaceholderElement().cloneNode(true);
        this.spicePageBuilderService.dragPlaceholderNode = placeholderNode;
        event.container.element.nativeElement.insertBefore(placeholderNode, event.item.getPlaceholderElement());
    }

    /**
     * remove placeholder element if exists
     * @param event
     */
    private onDragEnter(event: CdkDragEnter) {
        if (this.spicePageBuilderService.dragPlaceholderNode && event.container.element.nativeElement.contains(this.spicePageBuilderService.dragPlaceholderNode)) {
            event.container.element.nativeElement.removeChild(this.spicePageBuilderService.dragPlaceholderNode);
            this.spicePageBuilderService.dragPlaceholderNode = undefined;
        }
    }

    /**
     * emit the page data by the service
     * @private
     */
    private save() {
        this.spicePageBuilderService.emitData();
    }

    /**
     * emit the page data by the service
     * @private
     */
    private cancel() {
        this.spicePageBuilderService.emitData(true);
        this.self.destroy();
    }
}
