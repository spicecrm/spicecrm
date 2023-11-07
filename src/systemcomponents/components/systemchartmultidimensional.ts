import {Component, ContentChildren, Input, OnDestroy, QueryList} from '@angular/core';
import {SystemChartOneDimensional} from "./systemchartonedimensional";
import {SystemChartDataColumn} from "./systemchartdatacolumn";
import {
    GoogleChartOptionsI,
    GoogleChartDataRowI,
    GoogleChartTypeMultiDimensional,
} from "../interfaces/systemcomponents.interfaces";
import {SystemChartDataRow} from "./systemchartdatarow";
import {SystemChartService} from "../services/systemchart.service";

@Component({
    selector: 'system-chart-multi-dimensional',
    templateUrl: '../templates/systemchartmultidimensional.html',
    providers: [SystemChartService]
})

export class SystemChartMultiDimensional extends SystemChartOneDimensional implements OnDestroy, GoogleChartOptionsI {
    /**
     * google chart type
     */
        // @ts-ignore
    @Input() public declare chartType: GoogleChartTypeMultiDimensional;
    /**
     * google chart type
     */
    @Input() public isStacked: boolean = false;
    /**
     * google chart type
     */
    @Input() public cols: {id: string, label: string}[] = [];
    /**
     * values components
     */
    @ContentChildren(SystemChartDataColumn) public columnChildren: QueryList<SystemChartDataColumn>;

    /**
     * config object to be passed to the service
     */
    get options(): GoogleChartOptionsI {
        return {
            legend: this.legend,
            colors: this.colors,
            fontSize: this.fontSize,
            is3D: this.is3D,
            isStacked: this.isStacked
        };
    }

    /**
     * load rows and columns from content children
     */
    public loadDataFromContentChildren() {

        if (this.columnChildren.length == 0) {
            return this.hasData = false;
        }

        this.data = {rows: [], cols: [{id: 'AxisY', label: 'AxisY', type: 'string'}]};

        // extract the columns names from the first y-axis
        this.data.cols = this.data.cols.concat(this.cols.map(col => (
            {...col, type: 'number'}
        )));

        this.columnChildren.forEach((y: SystemChartDataColumn) => {

            const row: GoogleChartDataRowI = {
                c: [{v: y.value}]
            };

            this.cols.forEach((col, idx: number) => {
                const child = y.rowChildren.find(cell => cell.label == col.label);
                row.c[idx+1] = !child ? null : {v: Number(child.value)};
            });

            this.data.rows.push(row);
        });
    }
}