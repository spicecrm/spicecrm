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
import {
    Component, ElementRef, Renderer2, Input, Output, OnDestroy, EventEmitter, ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {helper} from '../../services/helper.service';

@Component({
    selector: 'object-actionset-menu',
    templateUrl: './src/objectcomponents/templates/objectactionsetmenu.html',
    providers: [popup, helper]
})
export class ObjectActionsetMenu implements  OnDestroy {

    @ViewChild('acionsetcontainer', {read: ViewContainerRef, static: true}) acionsetcontainer: ViewContainerRef;

    @Input() actionset: string = '';
    @Input() buttonsize: string = '';
    @Output() action: EventEmitter<string> = new EventEmitter<string>();
    isOpen: boolean = false;
    popupSubscription: any;
    clickListener: any;

    constructor(private language: language, private model: model, private metadata: metadata, private elementRef: ElementRef, private renderer: Renderer2, private popup: popup, private helper: helper) {
        this.popupSubscription = this.popup.closePopup$.subscribe(close => {
            this.isOpen = false;
        })
    }

    ngOnDestroy() {
        this.popupSubscription.unsubscribe();
    }

    hasNoActions() {
        return false;
    }

    toggleOpen() {
        this.isOpen = !this.isOpen;

        // toggle the listener
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));



        } else if (this.clickListener)
            this.clickListener();

    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    getButtonSizeClass() {
        if (this.buttonsize !== '')
            return 'slds-button--icon-' + this.buttonsize;
    }

    getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 100)
            return 'slds-dropdown--bottom';
    }
}
