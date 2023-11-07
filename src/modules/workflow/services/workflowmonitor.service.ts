import {Injectable} from '@angular/core';
import {
    SelectedChartObject,
    WorkflowChartApiConfig,
    WorkflowChartComponentConfigI
} from "../interfaces/workflow.interfaces";
import {backend} from "../../../services/backend.service";

@Injectable()
export class WorkflowMonitorService {
    /**
     * holds the selected chart data
     */
    public apiConfig: WorkflowChartApiConfig;
    /**
     * holds the selected chart data
     */
    public selectedChartObject: SelectedChartObject;
    /**
     * holds the is loading boolean
     */
    public isLoading: boolean = false;
    /**
     * holds the is loading more boolean
     */
    public isLoadingMore: boolean = false;
    /**
     * holds the list data
     */
    public listData: {total: number, list: any[]};

    constructor(private backend: backend) {
    }

    /**
     * get the chart list data from the backend api
     */
    public loadListData() {

        this.listData = undefined;

        if (!this.apiConfig?.listMethod) return;

        this.isLoading = true;

        const params = {
            ...this.apiConfig,
            selectedObject: this.selectedChartObject?.idObject
        };

        this.backend.getRequest(`module/Workflows/chart/selection/list`, params).subscribe({
            next: data => {
                this.isLoading = false;
                this.listData = data.listData;
            },
            error: () => this.isLoading = false
        });
    }

    /**
     * get more chart list data from the backend api
     */
    public loadMoreListData() {

        if (this.isLoading || this.isLoadingMore || this.listData.list.length >= this.listData.total) return;

        this.isLoadingMore = true;

        const params = {
            ...this.apiConfig,
            selectedObject: this.selectedChartObject?.idObject
        };

        params.methodParams.offset = this.listData.list.length;

        this.backend.getRequest(`module/Workflows/chart/selection/list`, params).subscribe({
            next: data => {
                this.isLoadingMore = false;
                this.listData.list = this.listData.list.concat(data.listData.list);
            },
            error: () => this.isLoadingMore = false
        });
    }
}