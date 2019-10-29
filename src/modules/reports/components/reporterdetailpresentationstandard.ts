/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {reporterconfig} from '../services/reporterconfig';

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-standard',
    templateUrl: './src/modules/reports/templates/reporterdetailpresentationstandard.html'
})
export class ReporterDetailPresentationStandard implements AfterViewInit, OnInit {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;
    @ViewChild('tableheader', {read: ViewContainerRef, static: true}) private tableheader: ViewContainerRef;
    @ViewChild('tablefooter', {read: ViewContainerRef, static: true}) private tablefooter: ViewContainerRef;

    private presParams: any = {};
    private presData: any = {};
    private fieldsData: any = {};
    private totalWidth: number = 0;
    private showFooter: boolean = true;

    private currentPage: number = 1;

    private isLoading: boolean = true;

    private sortData: any = {
        sortField: '',
        sortDirection: ''
    }

    constructor(private language: language, private model: model, private backend: backend, private reporterconfig: reporterconfig) {
        this.reporterconfig.refresh$.subscribe(event => {
            this.getPresentation();
        });
    }


    public ngOnInit() {
        this.presParams = this.model.getField('presentation_params');
    }

    public ngAfterViewInit() {
        this.getPresentation();
    }


    private isSortable(field) {
        return field.sort && field.sort != '-';
    }

    /**
     * gets additonalö display classes for the header field
     *
     * @param field
     */
    private displayClasses(field) {
        let classes = [];

        if (this.isSortable(field)) {
            classes.push('slds-is-sortable');
            if (field.fieldid == this.sortData.sortField) {
                classes.push('slds-is-sorted');
                if (this.sortData.sortDirection == 'asc') {
                    classes.push('slds-is-sorted_asc');
                }
            }
        }

        switch (field.type) {
            case 'currency':
            case 'currencyint':
                classes.push('slds-grid--align-end')
                break;
            case 'enum':
                classes.push('slds-grid--align-center')
                break;
        }

        return classes.join(' ');
    }

    private toggleSearch(field) {
        if (this.isSortable(field)) {
            if (this.sortData.sortField == field.fieldid) {
                if (this.sortData.sortDirection == 'asc') {
                    this.sortData.sortDirection = 'desc';
                } else {
                    this.sortData.sortField = '';
                    this.sortData.sortDirection = '';
                }
                this.getPresentation();
            } else {
                this.sortData.sortField = field.fieldid;
                this.sortData.sortDirection = 'asc';
                this.getPresentation();
            }
        }
    }

    // todo : fix this for scrolling with a fixed table header
    private getContainerStyle(): any {
        let recth = this.tableheader.element.nativeElement.getBoundingClientRect();
        if (this.showFooter) {
            let rectf = this.tablefooter.element.nativeElement.getBoundingClientRect();
            return {
                height: 'calc(100% - ' + (recth.height + rectf.height) + 'px)'
            };
        } else {
            return {
                height: 'calc(100% - ' + recth.height + 'px)'
            };
        }
    }

    private onScroll(e) {

    }

    /**
     * returns the set listentries from the pres params if set ... by default 25
     */
    get listEntries() {
        try {
            return this.presParams.pluginData.standardViewProperties.listEntries;
        } catch (e) {
            return 25;
        }
    }

    get displayRecords() {
        let startRecords = (this.currentPage - 1) * this.listEntries + 1;
        let endRecords = this.currentPage * this.listEntries;

        return startRecords + ' - ' + (endRecords > this.presData.count ? this.presData.count : endRecords);
    }

    get totalRecords() {
        return this.presData.count;
    }

    private getPresentation() {
        this.isLoading = true;

        // build wherecondition
        let whereConditions: any[] = [];
        for (let userFilter of this.reporterconfig.userFilters) {
            whereConditions.push({
                fieldid: userFilter.fieldid,
                operator: userFilter.operator,
                value: userFilter.value,
                valuekey: userFilter.valuekey,
                valueto: userFilter.valueto,
                valuetokey: userFilter.valuetokey
            });
        }

        let body = {
            start: (this.currentPage - 1) * this.listEntries,
            limit: this.listEntries,
            whereConditions: JSON.stringify(whereConditions),
            parentbeanId: this.model.getField('parentBeanId'),
            parentbeanModule: this.model.getField('parentBeanModule'),
            sort: undefined
        };

        if (this.sortData.sortField) {
            body.sort = JSON.stringify([{
                direction: this.sortData.sortDirection.toUpperCase(),
                property: this.sortData.sortField
            }]);
        }

        this.backend.postRequest(`KReporter/${this.model.id}/presentation/dynamicoptions`, {}, body).subscribe((presData: any) => {

            // get field width
            this.totalWidth = 0;
            for (let field of presData.reportmetadata.fields) {
                this.fieldsData[field.fieldid] = field;
                this.totalWidth += field.width;
            }

            this.presData = presData;

            this.isLoading = false;
        });
    }

    private getFields() {
        try {
            return this.presData.reportmetadata.fields;
        } catch (e) {
            return [];
        }
    }

    private getRecords() {
        try {
            return this.presData.records;
        } catch (e) {
            return [];
        }
    }

    private getFieldWidth(fieldid) {
        return Math.round(this.fieldsData[fieldid].width / this.totalWidth * 100) + '%';
    }

    /**
     * a helper function to determine the sort icon based on the set sort criteria
     */
    private getSortIcon(fieldid): string {
        return 'arrowdown';
        //    return 'arrowup';
    }

    get prevDisbaled() {
        return this.currentPage <= 1;
    }


    private firstPage() {
        this.currentPage = 1;
        this.getPresentation();
    }

    private prevPage() {
        this.currentPage--;
        this.getPresentation();
    }

    get nextDisabled() {
        return this.currentPage * this.listEntries >= this.presData.count;
    }

    private nextPage() {
        this.currentPage++;
        this.getPresentation();
    }

    private lastPage() {
        this.currentPage = Math.ceil(this.totalRecords / this.listEntries);
        this.getPresentation();
    }
}
