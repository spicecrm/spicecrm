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
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    templateUrl: './src/objectcomponents/templates/objectmodelpopover.html',
    providers: [model, view]
})
export class ObjectModelPopover implements OnInit {
    public popovermodule: string = '';
    public popoverid: string = '';
    public popoverside: string = 'right';
    public popoverpos: string = 'top';
    public styles = null;

    private hidePopoverTimeout: any = {};

    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;
    @ViewChild('relatedcontainer', {read: ViewContainerRef, static: true}) private relatedContainer: ViewContainerRef;

    public parentElementRef: any = null;
    public self: any = null;

    public fields: any[] = [];
    public fieldset: string = '';
    public componentset: string = '';
    public headercomponentset: string = '';

    private heightcorrection = 30;
    private widthcorrection = 30;

    constructor(
        public model: model,
        public view: view,
        public metadata: metadata,
    ) {
        this.view.displayLinks = false;
    }

    get relatedStyle() {
        return {'max-height': `calc(100vh - ${(this.relatedContainer.element.nativeElement.getBoundingClientRect().top  + 5)}px)`};
    }

    private goDetail() {
        this.model.goDetail();
    }

    private onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    private onMouseOut() {
        this.closePopover(true);
    }

    get popoverStyle() {
        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            this.popoverside = 'right';
        } else {
            this.popoverside = 'left';
        }

        // console.error('dimensions ', rect.top, poprect.height);

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + this.heightcorrection > 0) {
            this.popoverpos = 'bottom';
            return {
                top: (rect.top - poprect.height + this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        } else {
            this.popoverpos = 'top';
            return {
                top: (rect.top - this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        }
    }

    public ngOnInit() {
        // load the model
        this.model.module = this.popovermodule;
        this.model.id = this.popoverid;
        this.model.getData();

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('ObjectModelPopover', this.popovermodule);
        if (componentconfig.fieldset || componentconfig.componentset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);

            this.fieldset = componentconfig.fieldset;
            this.componentset = componentconfig.componentset;
            this.headercomponentset = componentconfig.headercomponentset;
        }

        // if we did not find a fieldset try to take the header one instead
        if (!this.fieldset) {
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.popovermodule);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
                this.fieldset = componentconfig.fieldset;
            }
        }

        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    private getNubbinClass() {
        return (this.popoverside == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + this.popoverpos;
    }

    public closePopover(force = false) {
        if (force) {
            this.self.destroy();
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }
}
