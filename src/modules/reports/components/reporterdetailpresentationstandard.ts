import {
    Component, Input, AfterViewInit, trigger, state, style, transition, animate, OnInit,
    OnDestroy, ViewChild, ViewContainerRef, Renderer, ElementRef
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

import  {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-detail-presentation-standard',
    templateUrl: './app/modules/reports/templates/reporterdetailpresentationstandard.html'
})
export class ReporterDetailPresentationStandard implements AfterViewInit, OnInit, OnDestroy {

    @ViewChild('tablecontent', {read: ViewContainerRef}) tablecontent: ViewContainerRef;
    @ViewChild('tableheader', {read: ViewContainerRef}) tableheader: ViewContainerRef;
    @ViewChild('tablefooter', {read: ViewContainerRef}) tablefooter: ViewContainerRef;

    presParams: any = {};
    presData: any = {};
    fieldsData: any = {};
    totalWidth: number = 0;
    mouseMoveListener: any = undefined;
    mouseUpListener: any = undefined;
    mousestart: number = 0;
    mousemove: number = 0;
    mousefield: string = '';
    mousewidth: number;
    showFooter: boolean = true;

    currentPage: number = 1;

    isLoading: boolean = true;


    constructor(private renderer: Renderer, private broadcast: broadcast, private metadata: metadata, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation, private elementRef: ElementRef, private reporterconfig: reporterconfig) {
        this.reporterconfig.refresh$.subscribe(event => {
            this.getPresentation();
        })
    }

    handleMessage(message: any) {

    }

    ngOnInit() {
        this.presParams = JSON.parse(this.model.data.presentation_params);
    }

    ngAfterViewInit() {
        this.getPresentation()
    }

    ngOnDestroy() {

    }

    // todo : fix this for scrolling with a fixed table header
    getContainerStyle(): any {
        let recth = this.tableheader.element.nativeElement.getBoundingClientRect();
        if (this.showFooter) {
            let rectf = this.tablefooter.element.nativeElement.getBoundingClientRect();
            return {
                height: 'calc(100% - ' + (recth.height + rectf.height) + 'px)'
            }
        } else {
            return {
                height: 'calc(100% - ' + recth.height + 'px)'
            }
        }
    }

    onScroll(e) {

    }

    get displayRecords() {
        let startRecords = (this.currentPage - 1) * this.presParams.pluginData.standardViewProperties.listEntries + 1;
        let endRecords = this.currentPage * this.presParams.pluginData.standardViewProperties.listEntries;

        return startRecords + ' - ' + (endRecords > this.presData.count ? this.presData.count : endRecords );
    }

    get totalRecords() {
        return this.presData.count;
    }

    getPresentation() {
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
            })
        }

        this.backend.getRequest('KReporter/' + this.model.id + '/presentation', {
            start: (this.currentPage - 1) * this.presParams.pluginData.standardViewProperties.listEntries,
            limit: this.presParams.pluginData.standardViewProperties.listEntries,
            whereConditions: JSON.stringify(whereConditions)
        }).subscribe((presData: any) => {

            // get field width
            this.totalWidth = 0;
            for (let field of presData.reportmetadata.fields) {
                this.fieldsData[field.fieldid] = field;
                this.totalWidth += field.width;
            }

            this.presData = presData;

            this.isLoading = false;
        })
    }

    getFields() {
        try {
            return this.presData.reportmetadata.fields;
        } catch (e) {
            return [];
        }
    }

    getRecords() {
        try {
            return this.presData.records;
        } catch (e) {
            return [];
        }
    }

    getFieldWidth(fieldid) {
        return Math.round(this.fieldsData[fieldid].width / this.totalWidth * 100) + '%';
    }

    onMouseDown(fieldid, e) {
        this.mouseUpListener = this.renderer.listenGlobal('document', 'mouseup', (event) => this.onMouseUp(event));
        this.mouseMoveListener = this.renderer.listenGlobal('document', 'mousemove', (event) => this.onMouseMove(event));
        this.mousestart = e.pageX;
        this.mousefield = fieldid;
    }

    onMouseMove(e) {
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

    prevPage() {
        this.currentPage--;
        this.getPresentation();
    }

    get nextDisabled() {
        return this.currentPage * this.presParams.pluginData.standardViewProperties.listEntries >= this.presData.count;
    }

    nextPage() {
        this.currentPage++;
        this.getPresentation();
    }
}