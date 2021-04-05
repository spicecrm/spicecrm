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
 * @module ObjectFields
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-model-footer-popover',
    templateUrl: './src/objectfields/templates/fieldmodelfooterpopover.html',
    providers: [model, view]
})
export class fieldModelFooterPopover implements OnInit {
    public popovermodule: string = '';
    public popoverid: string = '';
    public popoverside: string = 'right';
    public styles = null;
    public mouseover: boolean = false;

    private hidePopoverTimeout: any = {};

    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;

    public parentElementRef: any = null;
    public self: any = null;

    public modelIsLoading: boolean = false;
    public fields: Array<any> = [];

    constructor(
        private model: model,
        private view: view,
        private metadata: metadata,
    ) {

    }

    private goDetail() {
        this.model.goDetail();
    }

    private onMouseOver() {
        this.mouseover = true;

        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    private onMouseOut() {
        this.mouseover = false;
        this.self.destroy();
        // this.self.destroy();
    }

    get popoverStyle() {
        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            this.popoverside = 'right';
        } else {
            this.popoverside = 'left';
        }

        let styles = {
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 15) + 'px'
        };

        return styles;
    }

    public ngOnInit() {

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('fieldModelFooterPopover', this.popovermodule);
        if (componentconfig.fieldset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset)
        } else {
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.popovermodule);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset)
            }
        }

        // load the model
        this.modelIsLoading = true;
        this.model.module = this.popovermodule;
        this.model.id = this.popoverid;
        this.model.getData().subscribe(() => {
            this.modelIsLoading = false;
        });
        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    private getNubbinClass() {
        return this.popoverside == 'left' ? 'slds-nubbin--right' : 'slds-nubbin--left';
    }

    public closePopover(force = false) {
        // this.destroyPopover();
        if (force) {
            this.self.destroy()
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }
}
