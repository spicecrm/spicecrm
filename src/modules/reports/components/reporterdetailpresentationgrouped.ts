/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit,
    OnDestroy, ViewChild, ViewContainerRef, Renderer, ElementRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

import {reporterconfig} from '../services/reporterconfig';

/**
 * renders the standard view for a report which is a simple column based view
 */
@Component({
    selector: 'reporter-detail-presentation-grouped',
    templateUrl: './src/modules/reports/templates/reporterdetailpresentationgrouped.html'
})
export class ReporterDetailPresentationGrouped implements AfterViewInit, OnInit {

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

    constructor(private renderer: Renderer, private broadcast: broadcast, private metadata: metadata, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation, private elementRef: ElementRef, private reporterconfig: reporterconfig) {
        this.reporterconfig.refresh$.subscribe(event => {
            this.getPresentation();
        });
    }

    public ngOnInit() {
        this.presParams = JSON.parse(this.model.data.presentation_params);
    }

    public ngAfterViewInit() {
        this.getPresentation();
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


}
