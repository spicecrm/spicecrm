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
 * @module DirectivesModule
 */
import {
    Directive,
    Input,
    HostListener,
    OnDestroy,
    ElementRef,
    OnChanges,
    Optional,
    Injector,
    SkipSelf
} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {navigationtab} from "../../services/navigationtab.service";


/**
 * displays a popover over an item
 */
@Directive({
    selector: '[system-model-popover]',
    host: {
        '[class.slds-text-link_faux]': '!disableLink'
    },
    providers: [model]
})
export class SystemModelPopOverDirective implements OnChanges, OnDestroy {
    /**
     * the module for the popover
     */
    @Input() private module: string;

    /**
     * the if od the model for the popover
     */
    @Input() private id: string;

    /**
     * if set to true the item is presented as a link
     */
    @Input() private enablelink: boolean = true;

    /**
     * if the modelpopover shoudl be enabled or not
     * this allows to add the directive but disable it by a parameter on the component if e.g. the popover shoudl be displayed conditional
     */
    @Input('system-model-popover') private modelPopOver: boolean = true;

    /**
     * the popover that is rendered
     */
    private popoverCmp = null;

    /**
     * a timeout that renders the component only when the user hovers ovet eh component and does not leave short time after
     * this prevents a somehwta too nervous loading of popovers
     */
    private showPopoverTimeout: any = {};


    private popoverModelInitialized: boolean = false;

    constructor(
        private metadata: metadata,
        private footer: footer,
        @Optional() @SkipSelf() private model: model,
        @Optional() private navigationtab: navigationtab,
        private popovermodel: model,
        private elementRef: ElementRef,
        @Optional() private view: view,
        private router: Router,
        private injector: Injector
    ) {

    }

    @HostListener('mouseenter')
    private onMouseOver() {
        if (this.modelPopOver !== false) {
            this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 1000);
        }
    }

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
     * react to the click and if the link is there navigate to the record
     */
    @HostListener('click')
    private goRelated() {
        if (this.modelPopOver === false || this.disableLink) return false;

        // if we have apopover close it
        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }

        // if a timeout is running .. stop it
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        // check if the link is the model that is in the focus
        // go to the record
        if (!this.model || !this.id || (this.model.id == this.id && this.model.module == this.module)) {
            this.model.goDetail(this.navigationtab?.tabid);
        } else if (this.popoverModelInitialized) {
            this.popovermodel.goDetail(this.navigationtab?.tabid);
        } else {
            this.popovermodel.getData(true).subscribe(loaded => {
                this.popovermodel.goDetail(this.navigationtab?.tabid);
            });
        }
    }

    /**
     * checks if the view disables the links and then onlyrneders a popover
     */
    get disableLink() {
        return (this.view && this.view.displayLinks === false) || this.enablelink === false;
    }

    /**
     * renders the popover if a footer container if in the footer service
     */
    private renderPopover() {
        if (this.footer.footercontainer) {

            // if we are no initialized load the data
            if(!this.popoverModelInitialized) {
                if (!!this.model && (!this.model || !this.id || (this.model.module == this.module && this.model.id == this.id))) {
                    this.popovermodel.module = this.model.module;
                    this.popovermodel.id = this.model.id;
                    this.popovermodel.initialize();
                    this.popovermodel.data = this.model.data;
                    this.popoverModelInitialized = true;
                } else {
                    this.popovermodel.getData().subscribe(() => {
                        this.popoverModelInitialized = true;
                    });
                }
            }

            // render the popover
            this.metadata.addComponent('ObjectModelPopover', this.footer.footercontainer, this.injector).subscribe(
                popover => {
                    popover.instance.parentElementRef = this.elementRef;
                    this.popoverCmp = popover.instance;
                }
            );
        }
    }

    public ngOnChanges() {
        // set the data for the popover model and if we had it initialized reset it to false
        if(this.id && this.module && this.id != this.popovermodel.id && this.module != this.popovermodel.module) {
            this.popoverModelInitialized = false;
            this.popovermodel.initialize();
            this.popovermodel.id = this.id;
            this.popovermodel.module = this.module;
        }
    }

    public ngOnDestroy() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverCmp) {
            this.popoverCmp.closePopover(true);
        }
    }
}
