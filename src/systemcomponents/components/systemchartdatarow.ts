import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-chart-data-row',
    template: ''
})

export class SystemChartDataRow {

    /**
     * holds the label of the series
     */
    @Input() public label: string;
    /**
     * holds the dimension value
     */
    @Input() public value: number;
}