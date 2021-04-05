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
 * @module ModuleReports
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-filter-saved-filters',
    templateUrl: './src/modules/reports/templates/reporterfiltersavedfilters.html'
})
export class ReporterFilterSavedFilters implements OnInit {

    @Output() private selectFilterChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() private reportId: string = '';
    @Input() private _selectedFilterId: string = '';

    private savedFilters: any[] = [];

    constructor(private metadata: metadata, private model: model, private language: language, private reporterconfig: reporterconfig, private backend: backend) {

    }

    /**
     * @return selectedFilter: string
     */
    get selectedFilter() {
        return this._selectedFilterId;
    }

    /**
     * set selected filter and emit the change and set the saved filter in reportconfig service
     * @param filterId: string
     */
    set selectedFilter(filterId) {
        this._selectedFilterId = filterId;
        if (this._selectedFilterId.length == 0) {
            this.reporterconfig.setDefaultUserFilter();
            this.selectFilterChange.emit(null);
        } else {
            this.selectFilterChange.emit(filterId);
            this.savedFilters.some(filter => {
                if (filter.savedfilter_id == filterId) {
                    this.reporterconfig.setSavedFilter(JSON.parse(filter.selectedfilters));
                    return true;
                }
            });
        }
    }

    /**
     * @return isDisabled: boolean
     */
    get isDisabled() {
        return this.savedFilters.length == 0;
    }

    /**
     * load the savedFilters
     */
    public ngOnInit() {
        this.backend.getRequest(`KReporter/${this.reportId}/savedfilter/assigneduserid/own`)
            .subscribe(filters => {
                this.savedFilters = filters;
            });
    }

    /**
     * called from parent to push the new filter to the savedFilters array.
     * @param newFilter: object
     */
    public pushNewFilter(newFilter) {
        newFilter.selectedfilters = JSON.stringify(newFilter.selectedfilters);
        if (!!newFilter.is_global) newFilter.name = '(G) ' + newFilter.name;
        this.savedFilters.push(newFilter);
        this.selectedFilter = newFilter.savedfilter_id;
    }

    /**
     * update filter data from service
     */
    public updateFilterData() {
        this.savedFilters.some(filter => {
            if (this.selectedFilter == filter.savedfilter_id) {
                filter.selectedfilters = JSON.stringify(this.reporterconfig.userFilters);
                return true;
            }
        });
    }
}
