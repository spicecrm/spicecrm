/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'reports-designer-integrate-item-filters',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrateitemfilters.html'
})
export class ReportsDesignerIntegrateItemFilters {

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
}
