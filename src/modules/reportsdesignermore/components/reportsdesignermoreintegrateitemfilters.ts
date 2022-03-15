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
    templateUrl: '../templates/reportsdesignermoreintegrateitemfilters.html'
})
export class ReportsDesignerMoreIntegrateItemFilters {

    public expandedId: string = '';
    public savedFilters: any[];
    public isLoading: boolean = false;

    constructor(public language: language,
                public model: model,
                public backend: backend,
                public modal: modal) {
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
    public loadSaveFilters() {
        this.isLoading = true;
        this.backend.getRequest(`module/KReports/${this.model.id}/savedfilters`).subscribe(filters => {
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
    public deleteFilter(filterId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.backend.deleteRequest(`module/KReports/${this.model.id}/savedfilter/${filterId}`).subscribe(res => {
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
    public toggleExpansion(filterId) {
        this.expandedId = this.expandedId == filterId ? '' : filterId;
    }

    /**
     * manipulate the filterDefs definition
     * @param selectedFilters: object[]
     * @return selectedFilters: object[]
     */
    public mapFilterDefs(selectedFilters) {
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
    public trackByFn(index, item) {
        return item.savedfilter_id;
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFnFilterDef(index, item) {
        return item.fieldid;
    }
}
