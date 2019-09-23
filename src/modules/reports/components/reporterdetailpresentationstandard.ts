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

    constructor(private language: language, private model: model, private backend: backend,  private reporterconfig: reporterconfig) {
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


    private displayClasses(field) {
        let classes = [];

        if (field.sortable) classes.push('slds-is-sortable');

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

    get displayRecords() {
        let startRecords = (this.currentPage - 1) * this.presParams.pluginData.standardViewProperties.listEntries + 1;
        let endRecords = this.currentPage * this.presParams.pluginData.standardViewProperties.listEntries;

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

        this.backend.getRequest('KReporter/' + this.model.id + '/presentation', {
            start: (this.currentPage - 1) * this.presParams.pluginData.standardViewProperties.listEntries,
            limit: this.presParams.pluginData.standardViewProperties.listEntries,
            whereConditions: JSON.stringify(whereConditions),
            parentbeanId: this.model.getField('parentBeanId'),
            parentbeanModule: this.model.getField('parentBeanModule')
        }).subscribe((presData: any) => {

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

    private prevPage() {
        this.currentPage--;
        this.getPresentation();
    }

    get nextDisabled() {
        return this.currentPage * this.presParams.pluginData.standardViewProperties.listEntries >= this.presData.count;
    }

    private nextPage() {
        this.currentPage++;
        this.getPresentation();
    }
}
