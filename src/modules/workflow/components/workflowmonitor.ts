import {AfterViewInit, Component, QueryList, ViewChildren} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {WorkflowMonitorService} from "../services/workflowmonitor.service";
import {WorkflowChartComponentConfigI} from "../interfaces/workflow.interfaces";
import {WorkflowChart} from "./workflowchart";

@Component({
    selector: 'workflow-monitor',
    templateUrl: '../templates/workflowmonitor.html',
    providers: [WorkflowMonitorService]
})

export class WorkflowMonitor implements AfterViewInit {
    /**
     * holds the component config
     */
    public componentConfig: { workflowsFieldset?: string, chartsComponentSet?: string } = {};
    /**
     * holds the active slide index
     */
    public activeChartIdx: number = 0;
    /**
     * holds the standard charts loaded from the componentset
     */
    public charts: WorkflowChartComponentConfigI[] = [
        {
            title: 'LBL_OPEN_WITH_AGING',
            chartType: 'Bar',
            method: 'openWithAging', listMethod: 'openWithAging',
            isStacked: true,
            legend: {position: 'right'}
        }
    ];
    /**
     * the chart child components reference array
     * @private
     */
    @ViewChildren(WorkflowChart) private wcs: QueryList<WorkflowChart>;

    constructor(private metadata: metadata,
                public wms: WorkflowMonitorService) {
        this.initialize();
    }

    /**
     * set active chart and reload chart data
     * @param idx
     */
    public setActiveChart(idx: number) {
        this.activeChartIdx = idx;
        const chartComponent = this.wcs.get(idx);

        chartComponent.updateServiceApiConfig();

        if (!chartComponent.chartData) {
            chartComponent.loadData();
        } else {
            chartComponent.setServiceListData();
        }
    }

    /**
     * set the first active chart
     */
    public ngAfterViewInit() {
        if (this.charts?.length == 0) return;
        window.setTimeout(() => this.setActiveChart(0));
    }

    /**
     * initialize the definition list
     * @private
     */
    private initialize() {
        this.componentConfig = this.metadata.getComponentConfig('WorkflowMonitor', 'Workflows');
        this.charts = this.metadata.getComponentSetObjects(this.componentConfig.chartsComponentSet)
            .map(c => c.componentconfig)
            .map(c => ({
                title: c.name,
                isStacked: c.isStacked,
                onlySingleDefinition: c.onlySingleDefinition,
                chartType: c.chartType,
                method: c.method,
                methodParams: !c.methodParams ? null : JSON.parse(c.methodParams),
                listMethod: c.listMethod,
                legend: !c.legend || c.legend == 'none' ? {position: 'none'} : {
                    position: c.legend.split('::')[0],
                    alignment: c.legend.split('::')[1],
                }
            }));
    }

    /**
     * on scroll load more
     * @param element
     */
    public onScroll(element: HTMLElement) {
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.wms.loadMoreListData();
        }
    }
}