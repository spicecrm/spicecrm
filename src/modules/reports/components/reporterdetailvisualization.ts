/**
 * @module ModuleReports
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {reporterconfig} from '../services/reporterconfig';
import {Subscription} from "rxjs";
import {toast} from "../../../services/toast.service";

/**
 * handle rendering the appropriate visualization component for the report
 */
@Component({
    selector: 'reporter-detail-visualization',
    templateUrl: '../templates/reporterdetailvisualization.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailVisualization implements AfterViewInit, OnDestroy {
    /**
     * reference id will be sent with each backend request to enable canceling the pending requests
     */
    public httpRequestsRefID: string = window._.uniqueId('reporter_visualization_http_ref_');
    /**
     * the reference to the comtainer for the visualization item
     */
    @ViewChild('vizcontainer', {read: ViewContainerRef, static: true}) public vizcontainer: ViewContainerRef;

    /**
     * the parentmodule so if we are in the context that can be filtered properly
     */
    @Input() public parentModule: string = '';

    /**
     * the id of the parent reord also used to render in teh context
     */
    @Input() public parentId: string = '';

    /**
     * set to true to display embedded
     * if true a header and refresh button is displayed
     */
    @Input() public displayEmbedded: boolean = false;

    /**
     * when the comonent is loading
     */
    public loading: boolean = true;

    /**
     * the vizualizationdata
     */
    public vizData: any = {};

    /**
     * the rendered chartcomponent
     */
    public chartComponent: any;

    /**
     * holds the subscriptions for thsi component
     */
    public subscriptions = new Subscription();

    constructor(public reporterconfig: reporterconfig,
                public metadata: metadata,
                public model: model,
                public toast: toast,
                public backend: backend,
                public cdRef: ChangeDetectorRef) {
        this.subscriptions.add(
            this.reporterconfig.refresh$.subscribe({
                next: event => {
                    if (event) {
                        this.getVisualization();
                    } else {
                        this.handleCancel();
                    }
                }
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
        this.backend.cancelPendingRequests([this.httpRequestsRefID]);
    }

    /**
     * removes the chart component and relaods from the backend
     */
    public reload(){
        // reset the view
        if(this.chartComponent) {
            this.chartComponent.destroy();
            this.chartComponent = null;
        }
        this.getVisualization();
    }

    /**
     * gets the visualization for the report
     */
    public getVisualization() {

        this.loading = true;
        this.reporterconfig.isLoading.visualization = true;
        this.cdRef.detectChanges();

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

        this.backend.cancelPendingRequests([this.httpRequestsRefID]);

        this.backend.getRequest('module/KReports/' + this.model.id + '/visualization', params, this.httpRequestsRefID).subscribe({
            next: vizData => {
                this.vizData = vizData;
                this.loading = false;
                this.reporterconfig.isLoading.visualization = false;
                this.cdRef.detectChanges();
                this.renderVisualization();
            },
            error: () => {
                this.toast.sendToast('ERR_LOADING_RECORD', 'error');
                this.loading = false;
                this.reporterconfig.isLoading.visualization = false;
                this.cdRef.detectChanges();
            }
        });
    }

    get visualizationStyle(){
        return {
            height: this.displayEmbedded ? "calc(100% - 36px)" : "100%"
        }
    }

    /**
     * renders the visualization
     *
     * ToDo: remove the hardcoded components and keep this more flexibile in line with the architecture we are having
     */
    public renderVisualization() {
        // reset the view
        if(this.chartComponent) {
            this.chartComponent.destroy();
            this.chartComponent = null;
        }

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
                    this.chartComponent = componentRef;
                    componentRef.instance.vizdata = visualization;
                    componentRef.changeDetectorRef.detectChanges();
                });
            }
        }
    }

    /**
     * opens the report
     */
    public openReport() {
        this.model.goDetail();
    }
    /**
     * handle cancelling the get request
     */
    public handleCancel() {
        this.loading = false;
        this.reporterconfig.isLoading.visualization = false;
        this.cdRef.detectChanges();
        this.backend.cancelPendingRequests([this.httpRequestsRefID]);
    }
}
