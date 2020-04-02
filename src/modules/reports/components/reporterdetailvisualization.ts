/**
 * @module ModuleReports
 */
import {
    Component, Input, AfterViewInit, ViewChild, ViewContainerRef, OnDestroy
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';
import {reporterconfig} from '../services/reporterconfig';
import {Subscription} from "rxjs";

@Component({
    selector: 'reporter-detail-visualization',
    templateUrl: './src/modules/reports/templates/reporterdetailvisualization.html'
})
export class ReporterDetailVisualization implements AfterViewInit, OnDestroy {
    @ViewChild('vizcontainer', {read: ViewContainerRef, static: true}) private vizcontainer: ViewContainerRef;

    /**
     * the parentmodule so if we are in the context that can be filtered properly
     */
    @Input() private parentModule: string = '';

    /**
     * the id of the parent reord also used to render in teh context
     */
    @Input() private parentId: string = '';

    /**
     * when the comonent is loading
     */
    private loading: boolean = true;

    /**
     * the vizualizationdata
     */
    private vizData: any = {};

    /**
     * the rendered chartcomponent
     */
    private chartComponent: any[] = [];

    /**
     * holds the subscriptions for thsi component
     */
    private subscriptions = new Subscription();

    constructor(private reporterconfig: reporterconfig, private metadata: metadata, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation) {
        this.subscriptions.add(
            this.reporterconfig.refresh$.subscribe(event => {
                this.getVisualization();
            })
        );
    }

    /**
     * load the visualization
     */
    public ngAfterViewInit() {
        this.getVisualization();
    }

    /**
     * unsubscribe from the service and other subscriptions
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * gets the visualization for the report
     */
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

    /**
     * renders the visualization
     *
     * ToDo: remove the hardcoded components and keep this more flexibile in line with the architecture we are having
     */
    private renderVisualization() {
        // reset the view
        this.chartComponent.forEach(componentRef => componentRef.destroy());
        this.chartComponent = [];

        for (let visualization of this.vizData) {
            let visComponent = '';
            switch (visualization.plugin) {
                case 'highcharts':
                    visComponent = 'ReporterDetailVisualizationHighcharts';
                    break;
                case 'googlecharts':
                    visComponent = 'ReporterDetailVisualizationGooglecharts';
                    break;
                case 'googlemaps':
                    visComponent = 'ReporterDetailVisualizationGoogleMaps';
                    break;
            }
            if (visComponent != '') {
                this.metadata.addComponent(visComponent, this.vizcontainer).subscribe(componentRef => {
                    this.chartComponent.push(componentRef);
                    componentRef.instance.vizdata = visualization;
                });
            }
        }
    }
}
