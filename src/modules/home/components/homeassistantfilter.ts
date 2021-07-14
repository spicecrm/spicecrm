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
 * @module ModuleHome
 */
import {Component, Renderer2, ElementRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {assistant} from '../../../services/assistant.service';

@Component({
    selector: 'home-assistant-filter',
    templateUrl: './src/modules/home/templates/homeassistantfilter.html'
})
export class HomeAssistantFilter {

    private isOpen: boolean = false;
    private clickListener: any;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private language: language, private metadata: metadata, private assistant: assistant) {

    }

    get activityTypes() {
        return this.assistant.activityTypes;
    }


    private toggleOpen(e: MouseEvent) {
        // stop the event propagation
        e.stopPropagation();

        // open the filter
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {

        // regitser the click listener
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }

    get filterColorClass() {
        return this.assistant.assistantFilters.objectfilters.length > 0 || this.assistant.assistantFilters.timefilter != 'all' ? 'slds-icon-text-error' : 'slds-icon-text-default';
    }

    /**
     * sets the filter
     *
     * @param filter
     * @param e
     * @private
     */
    private setFilter(filter, e) {
        if (filter == 'all') {
            this.assistant.assistantFilters.objectfilters = [];
        } else {
            if(!e) {
                let index = this.assistant.assistantFilters.objectfilters.indexOf(filter);
                this.assistant.assistantFilters.objectfilters.splice(index, 1);
            } else {
                this.assistant.assistantFilters.objectfilters.push(filter);
            }
        }
    }

    /**
     * returns if a filter module is set .. if non e is set all returns true
     *
     * @param filter
     * @private
     */
    private getChecked(filter) {
        if (filter == 'all') {
            return this.assistant.assistantFilters.objectfilters.length == 0 ? true : false;
        } else {
            return this.assistant.assistantFilters.objectfilters.indexOf(filter) >= 0 ? true : false;
        }
    }

    /**
     * closes the dialog
     *
     * @private
     */
    private closeDialog() {
        if (this.clickListener) {
            this.clickListener();
        }

        this.isOpen = false;
    }
}
