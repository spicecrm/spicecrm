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
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

/**
 * renders a popover for a model. The element that calls this needs to provide the model
 */
@Component({
    selector: 'object-model-popover',
    templateUrl: './src/objectcomponents/templates/objectmodelpopover.html',
    providers: [view]
})
export class ObjectModelPopover implements OnInit {

    /**
     * the side for the popover
     */
    public popoverside: 'right'|'left' = 'right';

    /**
     * the position of the popover
     */
    public popoverpos: 'top'|'bottom' = 'top';

    /**
     * additonal styles
     */
    public styles = null;

    /**
     *
     * @private
     */
    private hidePopoverTimeout: any = {};

    /**
     * reference to the popover for calculaiton of the size and position
     *
     * @private
     */
    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;

    /**
     * the related container if there are related elements rendered
     *
     * @private
     */
    @ViewChild('relatedcontainer', {read: ViewContainerRef, static: true}) private relatedContainer: ViewContainerRef;

    /**
     * the elementref to the parent element. Passd in when the modal is rendered to get the position for the overlay
     */
    public parentElementRef: any = null;

    /**
     * reference to the popover itsefl for destruction
     */
    public self: any = null;

    /**
     * the fields if they are rendered
     */
    public fields: any[] = [];

    /**
     * the fieldset if one is defined
     */
    public fieldset: string = '';

    /**
     * the componentset to be displayes
     */
    public componentset: string = '';

    /**
     * a header componentset if one is defined
     */
    public headercomponentset: string = '';

    /**
     * needed to position properly
     *
     * @private
     */
    private heightcorrection = 30;

    /**
     * needed to position the poopover properly
     *
     * @private
     */
    private widthcorrection = 30;

    constructor(
        public model: model,
        public view: view,
        public metadata: metadata,
    ) {
        this.view.displayLinks = false;
    }

    /**
     * get the style for the relate container limniting the height
     */
    get relatedStyle() {
        return {'max-height': `calc(100vh - ${(this.relatedContainer.element.nativeElement.getBoundingClientRect().top  + 5)}px)`};
    }

    /**
     * catch the mouse entry
     *
     * @private
     */
    private onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    /**
     * catch the mouse leave and close the modal
     *
     * @private
     */
    private onMouseOut() {
        this.closePopover();
    }

    /**
     * determine the style for the popover depending on the size and the parent element position
     */
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

    /**
     * initialize the component
     */
    public ngOnInit() {
        // load the fields
        let componentconfig = this.metadata.getComponentConfig('ObjectModelPopover', this.model.module);
        if (componentconfig.fieldset || componentconfig.componentset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);

            this.fieldset = componentconfig.fieldset;
            this.componentset = componentconfig.componentset;
            this.headercomponentset = componentconfig.headercomponentset;
        } else {
            // if we did not find a fieldset and have no component set try to take the header one instead
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.model.module);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
                this.fieldset = componentconfig.fieldset;
            }
        }

        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    /**
     * determine the nubbin side
     *
     * @private
     */
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
