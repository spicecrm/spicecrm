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
 * @module ModuleReports
 */
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';
import {animate, style, transition, trigger} from "@angular/animations";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {session} from "../../../services/session.service";

const REPORTERFILTERPANELANIMATIONS = [
    trigger('animatepopover', [
        transition(':enter', [
            style({opacity: 0}),
            animate('.25s', style({opacity: 1}))
        ]),
        transition(':leave', [
            style({opacity: '1'}),
            animate('.25s', style({opacity: 0}))
        ])
    ])
];

/**
 * renders a panel with the dynamic filters for a report
 */
@Component({
    selector: 'reporter-filter-panel',
    templateUrl: './src/modules/reports/templates/reporterfilterpanel.html',
    animations: REPORTERFILTERPANELANIMATIONS
})
export class ReporterFilterPanel {
    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;
    @ViewChild('savedFiltersContainer', {static: false}) private savedFiltersComponent;

    /**
     * an event emitter that emits when the filter is applied
     */
    @Output() private filterapplied: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the integration params
     */
    @Input() private integrationparams: any = {};

    private selectedFilterId: any;
    private showPopover: boolean = false;
    private filter: any = {};

    constructor(private model: model,
                private language: language,
                private elementRef: ElementRef,
                private toast: toast,
                private backend: backend,
                private session: session,
                private reporterconfig: reporterconfig) {

    }

    /**
     * @return isAdmin: boolean
     */
    get isAdmin() {
        return !!this.session.authData.admin;
    }

    /**
     * @return whereConditions: object[]
     */
    get whereConditions() {
        return this.reporterconfig.userFilters;
    }

    /**
     * positions the popover properly
     */
    get popoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let popRect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ((rect.height - popRect.height) / 2)) + 'px',
            left: (rect.left - popRect.width) + 'px'
        };
    }

    /**
     * checks if the plugin to save filters is enabled for the report
     */
    get displaySavedFilters() {
        return !!this.integrationparams.activePlugins && !!this.integrationparams.activePlugins.ksavedfilters;
    }

    /**
     * open new filter data popover
     */
    private openPopover() {
        this.showPopover = true;
        this.initializeFilter();
    }

    /**
     * close popover and initialize new filter
     */
    private closePopover() {
        this.showPopover = false;
        this.initializeFilter();
    }

    /**
     * initialize new filter
     */
    private initializeFilter() {
        this.filter = {
            savedfilter_id: this.model.generateGuid(),
            name: '',
            isNew: true,
            is_global: false
        };
    }

    /**
     * when the filter is to be applied
     */
    private applyFilter() {
        this.filterapplied.emit(true);
        this.reporterconfig.refresh();
    }

    /**
     * @param filterId
     */
    private setSelectedFilterId(filterId) {
        this.selectedFilterId = filterId;
    }

    /**
     * save the filter changes or create and save a new filter
     */
    private handleSave() {

        if (!this.selectedFilterId) {
            return this.openPopover();
        } else {
            this.saveFilter(this.selectedFilterId);
        }
    }

    /**
     * save the new filter to the database
     * call child methods to update the savedFilters array
     * @param id: string
     * @param newFilter: object
     */
    private saveFilter(id, newFilter?) {
        let data = {
            selectedfilters: {...this.reporterconfig.userFilters}
        };

        if (data) {
            data = {...newFilter, ...data};
        }

        this.backend.postRequest(`module/KReports/${this.model.id}/savedfilter/${id}`, [], data)
            .subscribe(res => {
                if (!!res && !!res.success) {
                    this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                    if (!!this.savedFiltersComponent) {
                        if (!!newFilter) {
                            this.savedFiltersComponent.pushNewFilter(data);
                        } else {
                            this.savedFiltersComponent.updateFilterData();
                        }
                    }
                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
            });
    }

    /**
     * open popover to fill in new filter data
     */
    private saveFilterAs() {
        if (!this.selectedFilterId) return;
        this.openPopover();
    }

    /**
     * reset selectedFilterId and save the new filter
     * close the popover
     */
    private confirmSave() {
        this.selectedFilterId = undefined;
        this.saveFilter(this.filter.savedfilter_id, this.filter);
        this.closePopover();
    }

}
