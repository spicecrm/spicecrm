import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-chart-one-dimensional-value',
    template: ''
})

export class SystemChartOneDimensionalValue {

    @Input() public label: string;
    @Input() public value: number;
}