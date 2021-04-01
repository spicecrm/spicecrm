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
 * @module ModuleReportsDesignerMore
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'reports-designer-more-integrate-item-filters',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermoreintegrateitemfilters.html'
})
export class ReportsDesignerMoreIntegrateItemFilters {

    private expandedId: string = '';
    protected savedFilters: any[];
    protected isLoading: boolean = false;

    constructor(private language: language,
                private model: model,
                private backend: backend,
                private modal: modal) {
    }

    /**
     * @return whereConditions: object[]
     */
    get whereConditions() {
        return this.model.getField('whereconditions');
    }

    /**
     * call loadSaveFilters
     */
    public ngOnInit() {
        this.loadSaveFilters();
    }

    /**
     * load the saved filters from backend
     */
    private loadSaveFilters() {
        this.isLoading = true;
        this.backend.getRequest(`KReporter/${this.model.id}/savedfilter`).subscribe(filters => {
            this.isLoading = false;
            if (!filters) return;

            this.savedFilters = filters.map(filter => {
                filter.selectedfilters = this.mapFilterDefs(filter.selectedfilters);
                filter.is_global = !!+filter.is_global;
                return filter;
            });
        });
    }

    /**
     * delete the filter with the given id
     * @param filterId: string
     */
    private deleteFilter(filterId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.backend.deleteRequest(`KReporter/${this.model.id}/savedfilter/${filterId}`).subscribe(res => {
                    if (!!res) {
                        this.savedFilters = this.savedFilters.filter(filter => filter.savedfilter_id != filterId);
                    }
                });
            }
        });
    }

    /**
     * toggle expansion
     * @param filterId: string
     */
    private toggleExpansion(filterId) {
        this.expandedId = this.expandedId == filterId ? '' : filterId;
    }

    /**
     * manipulate the filterDefs definition
     * @param selectedFilters: object[]
     * @return selectedFilters: object[]
     */
    private mapFilterDefs(selectedFilters) {
        if (selectedFilters && typeof selectedFilters == 'string') {
            selectedFilters = JSON.parse(selectedFilters);
        }
        if (!selectedFilters || selectedFilters.length == 0) return [];

        return selectedFilters.map(filterField => {
            filterField.fieldName = this.whereConditions.find(condition => condition.fieldid == filterField.fieldid).name;
            filterField.value = !!filterField.value ? filterField.operator == 'oneof' ? filterField.value.join(', ') : filterField.value : '';
            return filterField;
        });
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.savedfilter_id;
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFnFilterDef(index, item) {
        return item.fieldid;
    }
}
