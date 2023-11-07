import {Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {
    GoogleChartSelectedObject,
    GoogleChartTypeMultiDimensional
} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";
import {
    SelectedChartObject,
    WorkflowChartApiConfig,
    WorkflowChartComponentConfigI,
    WorkflowChartDataI,
} from "../interfaces/workflow.interfaces";
import {WorkflowMonitorService} from "../services/workflowmonitor.service";

/**
 * display a workflow chart for the fetched data from the backend
 */
@Component({
    selector: 'workflow-chart',
    templateUrl: '../templates/workflowchart.html'
})

export class WorkflowChart implements OnInit, OnChanges {
    /**
     * holds the chart type and method
     * the chart method could be on of the standard methods mapping object keys or a namespace for a backend method
     */
    @Input() public componentConfig: WorkflowChartComponentConfigI;
    /**
     * holds the chart data fetched from the backend
     */
    public chartData: WorkflowChartDataI;
    /**
     * holds the list data
     */
    public listData: {total: number, list: any[]};

    /**
     * holds the is loading boolean
     */
    public isLoading: boolean = false;
    /**
     * optional select list to enable send the selected id to the chart method
     */
    public workflowDefinitions: {id: string, name: string}[] = [];
    /**
     * optional selected id to be passed to the chart method
     */
    public selectedDefinitionId: string;
    /**
     * holds the selected chart data
     */
    public selectedChartObject: SelectedChartObject;
    /**
     * emit the index value of the selected SystemChartOneDimensionalValue row
     */
    @Output() public onValueClick = new EventEmitter<GoogleChartSelectedObject>();

    constructor(private backend: backend,
                private metadata: metadata,
                @Optional() private wms: WorkflowMonitorService) {
    }

    /**
     * return multidimensional chart type
     */
    get multiChartType(): GoogleChartTypeMultiDimensional {
        return this.componentConfig.chartType as GoogleChartTypeMultiDimensional;
    }

    /**
     * get config and data
     */
    public ngOnInit() {
        this.setComponentConfig();
        if (this.componentConfig.onlySingleDefinition) {
            this.loadDefinitions();
        }
    }

    /**
     * update config and reload
     */
    public ngOnChanges() {
        this.updateServiceApiConfig();
        if (this.componentConfig.onlySingleDefinition) {
            this.loadDefinitions();
        }
    }

    /**
     * load definitions
     * @private
     */
    private loadDefinitions() {

        this.workflowDefinitions = [];

        const sortArray = [{
            sortfield: 'name',
            sortdirection: 'ASC'
        }];

        this.backend.getList('WorkflowDefinitions', sortArray, {start: 0, limit: 500}).subscribe(res => {
            this.workflowDefinitions = res.list;
        })
    }

    /**
     * get the chart data from the backend api
     */
    public loadData() {

        this.chartData = undefined;

        if (!this.componentConfig?.method) return;

        this.isLoading = true;
        if (this.wms) {
            this.listData = undefined;
            this.wms.selectedChartObject = undefined;
            this.setServiceListData();
            this.wms.isLoading = true;
        }

        const params = this.generateApiParams();

        this.backend.getRequest(`module/Workflows/chart`, params).subscribe({
            next: data => {
                this.isLoading = false;
                this.chartData = data;

                if (this.wms && data.listData) {
                    this.listData = data.listData;
                    this.setServiceListData();
                    this.wms.isLoading = false;
                }
            },
            error: () => {
                this.isLoading = false;
                if (this.wms) this.wms.isLoading = false;
            }
        });
    }

    /**
     * set service list data
     */
    public setServiceListData() {
        this.wms.listData = this.listData;
    }

    /**
     * on selected definition id change
     */
    public onSelectedDefinitionIdChange() {
        this.updateServiceApiConfig();
        this.loadData();
    }

    /**
     * get the component config from workbench/module config
     * @private
     */
    private setComponentConfig() {

        if (!this.componentConfig) {
            this.componentConfig = this.metadata.getComponentConfig('WorkflowChart', 'Workflows');
        }

        this.updateServiceApiConfig();
    }

    /**
     * update service api config
     */
    public updateServiceApiConfig() {
        if (!this.wms) return;
        this.wms.apiConfig = this.generateApiParams();
    }

    /**
     * generate get data params
     * @private
     */
    private generateApiParams(): WorkflowChartApiConfig {
        return {
            method: this.componentConfig.method,
            methodParams: {...this.componentConfig.methodParams, selectedDefinitionId: this.selectedDefinitionId},
            isNamespace: Boolean(this.componentConfig.isNamespace),
            listMethod: this.wms ? this.componentConfig.listMethod : undefined
        };
    }

    /**
     * set selected object on the service
     * @param selectedObject
     */
    public setSelectedObject(selectedObject: GoogleChartSelectedObject) {

        if (this.wms) {
            this.selectedChartObject = this.generateSelectionObject(selectedObject);
            this.wms.selectedChartObject = this.selectedChartObject;
            this.wms.loadListData();
        }

        this.onValueClick.emit(selectedObject);
    }

    /**
     * propagate the selected chart object to the service in case of switching between the charts
     */
    public propagateSelectedChartObjectToService() {
        this.wms.selectedChartObject = this.selectedChartObject;
    }

    /**
     * generate selected object label from the data
     * @param obj
     * @return selectionObject
     * @private
     */
    private generateSelectionObject(obj: GoogleChartSelectedObject) {

        if (!obj) return undefined;

        const row = this.chartData.data[obj.row];

        return {
            indexObject: obj,
            idObject: {
                rowId: row.id,
                colId: !this.chartData.config.isMulti ? undefined : this.chartData.cols[obj.column - 1].id
            },
            label: !this.chartData.config.isMulti ? row.label : `${row.value}/${this.chartData.cols[obj.column - 1].label}`
        }
    }
}