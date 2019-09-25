/**
 * @module ModuleReports
 */
import {
    Component, Input, AfterViewInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';
import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-detail-visualization',
    templateUrl: './src/modules/reports/templates/reporterdetailvisualization.html'
})
export class ReporterDetailVisualization implements AfterViewInit {
    @ViewChild('vizcontainer', {read: ViewContainerRef, static: true}) private vizcontainer: ViewContainerRef;

    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';

    private loading: boolean = true;
    private vizData: any = {};
    private chartComponent: any;

    constructor(private reporterconfig: reporterconfig, private metadata: metadata, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation) {
        this.reporterconfig.refresh$.subscribe(event => {
            this.getVisualization();
        });
    }

    public ngAfterViewInit() {
        this.getVisualization();
    }

    private getVisualization() {
        let params: any = {};
        if (this.parentModule && this.parentId) {
            params.parentbeanId = this.parentId;
            params.parentbeanModule = this.parentModule;
        }

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
        params.whereConditions = JSON.stringify(whereConditions);

        this.backend.getRequest('KReporter/' + this.model.id + '/visualization', params).subscribe(vizData => {
            this.vizData = vizData;
            this.loading = false;
            this.renderVisualization();
        });
    }

    private renderVisualization() {
        for (let visualization of this.vizData) {
            let visComponent = '';
            switch (visualization.plugin) {
                case 'highcharts':
                    visComponent = 'ReporterDetailVisualizationHighcharts';
                    break;
                case 'googlecharts':
                    visComponent = 'ReporterDetailVisualizationGooglecharts';
                    break;
            }
            if (visComponent != '') {
                this.metadata.addComponent(visComponent, this.vizcontainer).subscribe(componentRef => {
                    this.chartComponent = componentRef;
                    componentRef.instance.vizdata = visualization;
                });
            }
        }
    }
}
