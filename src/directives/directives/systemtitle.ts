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
import {Directive, ElementRef, Input, OnDestroy, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from "../../services/language.service";

/**
 * translate the input label by the language service and set the title attribute for the element ref
 */
@Directive({
    selector: '[system-title]'
})
export class SystemTitleDirective implements OnDestroy {

    /**
     * the system label to be translated and set on the element title
     */
    @Input('system-title') private label: string;
    /**
     * rxjs subscription to unsubscribe the observables
     */
    private subscription = new Subscription();

    constructor(private language: language, private elementRef: ElementRef) {
        this.subscribeToCurrentLanguageChange();
    }

    /**
     * unsubscribe from the language service when the component is destroyed
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * check if the input label has changed and set the element title attribute
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.label.previousValue === changes.label.currentValue || !(!!changes.label.currentValue)) return;
        this.setElementTitleAttribute();
    }

    /**
     * subscribe to current language change and reset the element title
     */
    protected subscribeToCurrentLanguageChange() {
        this.subscription = this.language.currentlanguage$.subscribe(() => this.setElementTitleAttribute());
    }

    /**
     * set the element reference title attribute
     */
    private setElementTitleAttribute() {
        this.elementRef.nativeElement.setAttribute('title', this.language.getLabel(this.label));
    }
}
