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
 * @module Outlook
 */
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {footer} from "../../../services/footer.service";

/**
 * Footer component for the SpiceCRM Outlook add-in.
 * Used to show buttons with available actions.
 */
@Component({
    selector: 'groupware-detail-pane-footer',
    templateUrl: './src/include/groupware/templates/groupwaredetailpanefooter.html'
})
export class GroupwareDetailPanefooter implements AfterViewInit, OnDestroy {

    @ViewChild('footer', {static: false}) private footerElement;

    private _currentroute: string = 'groupware/mailitem';

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        private footer: footer,
        private elementRef: ElementRef
    ) {
    }

    public ngAfterViewInit(): void {
        this.setFooterHeight();
    }

    public ngOnDestroy(): void {
        this.clearFooterHeight();
    }

    /**
     * calculates the height of the panel element and sets it to the footer service
     */
    private setFooterHeight() {
        let cRect = this.footerElement.nativeElement.getBoundingClientRect();
        this.footer.visibleFooterHeight = cRect.height;
    }

    /**
     * sets the footer height in the sevrice back to 0
     */
    private clearFooterHeight() {
        this.footer.visibleFooterHeight = 0;
    }

    /**
     * Call an action.
     * @param action
     */
    private callAction(action) {
        this.router.navigate([action.actionconfig.route]);
    }

    get currentroute() {
        return this._currentroute;
    }

    set currentroute(route) {
        if (route) {
            this._currentroute = route;
            this.router.navigate([route]);
        }
    }

    /**
     * A list of available actions.
     */
    get actions() {
        let componentConfig = this.metadata.getComponentConfig('OutlookPane');
        if (componentConfig.actionset) {
            return this.metadata.getActionSetItems(componentConfig.actionset);
        }
        return [];
    }
}
