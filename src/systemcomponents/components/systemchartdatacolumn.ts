import {Component, ContentChildren, Input, QueryList} from '@angular/core';
import {SystemChartDataRow} from "./systemchartdatarow";

@Component({
    selector: 'system-chart-data-column',
    template: '',
    standalone: false
})

export class SystemChartDataColumn {
    /**
     * the content children values reference
     */
@ContentChildren(SystemChartDataRow) public rowChildren: QueryList<SystemChartDataRow>;
    /**
     * holds the dimension value
     */
    @Input() public value: number;
}