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
        this.backend.getRequest(`kreporter/${this.reportId}/savedfilters`, {assigneduserid:"own"})
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
