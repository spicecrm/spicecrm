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
 * @module GlobalComponents
 */
import {
    Component,
    Renderer2,
    ElementRef,
    OnDestroy
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {telephony} from '../../services/telephony.service';

@Component({
    selector: 'global-docked-composer-overflow',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposeroverflow.html'
})
export class GlobalDockedComposerOverflow implements OnDestroy {
    private showHiddenComposers: boolean = false;
    private clickListener: any;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private dockedComposer: dockedComposer, private telephony: telephony, private language: language) {

    }

    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    get hiddenCount() {
        return this.dockedComposer.composers.length + this.telephony.calls.length - this.dockedComposer.maxComposers;
    }

    private toggleHiddenComoposers() {
        this.showHiddenComposers = !this.showHiddenComposers;

        if (this.showHiddenComposers) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.showHiddenComposers = false;
            this.clickListener();
        }
    }


    get overflowComposers() {
        return this.dockedComposer.composers.slice(this.dockedComposer.maxComposers - this.telephony.calls.length);
    }

    private displayLabel(composer) {
        // return composer.model.data.name ? composer.model.data.name : this.language.getLabel(composer.module, 'LBL_NEW_FORM_TITLE');
        return composer.model.data.name ? composer.model.data.name : this.language.getModuleName(composer.model.module, true);
    }

    private focusComposer(composerid) {
        this.dockedComposer.focusComposer(composerid);
        this.showHiddenComposers = false;
    }
}
