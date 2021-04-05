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
 * @module DirectivesModule
 */
import {Directive, Input, HostListener, OnDestroy, ElementRef, OnInit, Optional} from '@angular/core';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";

/**
 * a generic popover directive that can be tied to an element and pass in an injector and a componentset to be rendered in the popover
 */
@Directive({
    selector: '[system-pop-over]',
})
export class SystemPopOverDirective implements OnDestroy {
    /**
     * reference to the component that is rendered as popover
     */
    private popoverCmp = null;

    /**
     * a timeout that is initalized when the user hovers over the component
     */
    private showPopoverTimeout: any = {};

    private _popoverSettings: any = {
        injector: {},
        componentset: {},
        component: ''
    }

    /**
     * as part of the attribute the model paramaters can be passed in
     *
     * @Input('modelProvider') provided_model:{
     *   module:string,
     *   id:string,
     *   data:any,
     *   };
     *
     * @param provided_model
     */
    @Input('system-pop-over')
    set popoverSettings(popoverSettings: { injector: any, component: string, componentset: any }) {
        this._popoverSettings.injector = popoverSettings.injector;
        this._popoverSettings.componentset = popoverSettings.componentset;
        this._popoverSettings.component = popoverSettings.component;
    }

    constructor(
        private metadata: metadata,
        private footer: footer,
        private elementRef: ElementRef
    ) {

    }

    /**
     * listens to the mouseenter event on the host and if the mouse enters starts the timeout to render the popover
     */
    @HostListener('mouseenter')
    private onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    /**
     * catches when the user leaves the host element and either stops the timeout or closes the popover
     */
    @HostListener('mouseleave')
    private onMouseOut() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }
    }

    /**
     * renders the popover
     */
    private renderPopover() {
        this.metadata.addComponent('SystemPopover', this.footer.footercontainer, this._popoverSettings.injector).subscribe(
            popover => {
                popover.instance.parentElementRef = this.elementRef;
                popover.instance.componentset = this._popoverSettings.componentset;

                this.popoverCmp = popover.instance;
            }
        );
    }

    /**
     * catches if the host component is destroyed and also destoys the popover
     */
    public ngOnDestroy() {
        if (this.popoverCmp) {
            this.popoverCmp.closePopover(true);
        }
    }
}
