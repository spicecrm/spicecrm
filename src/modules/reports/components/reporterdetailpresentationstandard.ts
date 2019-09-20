/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit,
    OnDestroy, ViewChild, ViewContainerRef, Renderer, ElementRef
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

import  {reporterconfig} from '../services/reporterconfig';

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
    private mouseMoveListener: any = undefined;
    private mouseUpListener: any = undefined;
    private mousestart: number = 0;
    private mousemove: number = 0;
    private mousefield: string = '';
    private mousewidth: number;
    private showFooter: boolean = true;

    private currentPage: number = 1;

    private isLoading: boolean = true;


    constructor(private renderer: Renderer, private broadcast: broadcast, private metadata: metadata, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation, private elementRef: ElementRef, private reporterconfig: reporterconfig) {
        this.reporterconfig.refresh$.subscribe(event => {
            this.getPresentation();
        })
    }

    private handleMessage(message: any) {

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

    private onScroll(e) {

    }

    get displayRecords() {
        let startRecords = (this.currentPage - 1) * this.presParams.pluginData.standardViewProperties.listEntries + 1;
        let endRecords = this.currentPage * this.presParams.pluginData.standardViewProperties.listEntries;

        return startRecords + ' - ' + (endRecords > this.presData.count ? this.presData.count : endRecords );
    }

    get totalRecords() {
        return this.presData.count;
    }

    private getPresentation() {
        this.isLoading = true;

        // build wherecondition
        let whereConditions: Array<any> = [];
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
            parentbeanId: this.model['parentBeanId'],
            parentbeanModule: this.model['parentBeanModule']
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

    private onMouseDown(fieldid, e) {
        this.mouseUpListener = this.renderer.listenGlobal('document', 'mouseup', (event) => this.onMouseUp(event));
        this.mouseMoveListener = this.renderer.listenGlobal('document', 'mousemove', (event) => this.onMouseMove(event));
        this.mousestart = e.pageX;
        this.mousefield = fieldid;
    }

    private onMouseMove(e) {
        this.mousemove = e.pageX - this.mousestart;
    }

    onMouseUp(e) {
        console.log('mouseup ' + this.mousefield);
        this.mouseUpListener();
        this.mouseMoveListener();

        // calculate the current column width
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let actWidth = rect.width / this.totalWidth * this.fieldsData[this.mousefield].width;

        this.fieldsData[this.mousefield].width = Math.round(this.fieldsData[this.mousefield].width * (actWidth + e.pageX - this.mousestart) / actWidth);
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
