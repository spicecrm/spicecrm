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
import {ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ButtonI, DividerI, HTMLCodeI, ImageI, SpacerI, TextI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-editor',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuildereditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderEditor {
    /**
     * hold the element to be edited
     */
    public element: TextI | ImageI | ButtonI | DividerI | SpacerI | HTMLCodeI;
    /**
     * emit the changes to the element
     */
    public response: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /**
     * holds a reference to the component for destroy
     */
    public self: any = {};
    /**
     * code container reference to beatify
     */
    @ViewChild('codeContainer', {read: ViewContainerRef, static: false}) private codeContainer: ViewContainerRef;


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
     * close the modal and pass false for no changes
     */
    private cancel() {
        this.response.next(false);
        this.response.complete();
        this.self.destroy();
    }

    /**
     * close the modal and emit response true for the element
     */
    private confirm() {
        this.response.next(JSON.parse(JSON.stringify(this.element)));
        this.response.complete();
        this.self.destroy();
    }
}
