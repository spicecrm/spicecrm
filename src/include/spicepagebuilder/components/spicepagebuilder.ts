/*
SpiceUI 2021.01.001

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
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDropListGroup} from "@angular/cdk/drag-drop";

/**
 * render spice page builder panel and renderer
 */
@Component({
    selector: 'spice-page-builder',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilder.html',
    providers: [SpicePageBuilderService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilder implements AfterViewInit {
    /**
     * reference of this component to allow destroy
     * @public
     */
    public self: any;
    /**
     * drop list reference to manage adding new lists
     */
    @ViewChild(CdkDropListGroup, {read: CdkDropListGroup, static: false}) private dropListGroup;
    /**
     * true when the drop list group ist defined
     * @private
     */
    private dropListGroupDefined: boolean = false;

    constructor(public spicePageBuilderService: SpicePageBuilderService, private cdRef: ChangeDetectorRef) {
    }

    /**
     * call to set drop list group reference
     */
    public ngAfterViewInit() {
        this.setDropListReference();
    }

    /**
     * set drop list group reference
     */
    private setDropListReference() {
        this.spicePageBuilderService.dropListGroup = this.dropListGroup;
        this.dropListGroupDefined = true;
        this.cdRef.detectChanges();
    }
}
