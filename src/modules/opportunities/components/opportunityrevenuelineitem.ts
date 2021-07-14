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
 * @module ModuleOpportunities
 */
import {Component, Input, Output, EventEmitter, OnChanges} from "@angular/core";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";

/**
 * a table line that representa a revenue share item
 */
@Component({
    selector: '[opportunity-revenue-line-item]',
    templateUrl: "./src/modules/opportunities/templates/opportunityrevenuelineitem.html",
    providers: [model]
})
export class OpportunityRevenueLineItem implements OnChanges {

    /**
     * input for the revenue line itself
     */
    @Input() private revenueLine: any;

    /**
     * the close date .. not too nice but needed so it can be passed from the parent in case the date is changed so changed etection is triggered when the dates are recalculated
     */
    @Input() private closeDate: any;

    /**
     * the total amount .. not too nice but needed so it can be passed from the parent in case the amount is changed so changed detection is triggered when the dates are recalculated
     */
    @Input() private totalAmount: any;

    /**
     * an event emitter that fires when the line is updated
     */
    @Output() private update: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * an event emitter that fires when the line is deleted
     */
    @Output() private delete: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private model: model, private view: view, private language: language) {
        this.model.module = 'OpportunityRevenueLines';
        this.model.data$.subscribe(data => {
            this.update.emit(true);
        });
    }


    /**
     * @ignore
     */
    public ngOnChanges(): void {
        this.model.id = this.revenueLine.id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.revenueLine);
    }

    /**
     * simple getter to detect if the buttons etc should be disabled
     */
    get disabled() {
        return !this.view.isEditMode();
    }

    /**
     * action to trigger deete of the line
     */
    private deleteitem() {
        this.delete.emit(true);
    }
}
