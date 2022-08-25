/**
 * @module ModuleSpiceMap
 */
import {
    AfterViewInit,
    Component,
    ViewChild
} from '@angular/core';
import {libloader} from '../../../services/libloader.service';

/** @ignore */
declare var Chart: any;

/**
 * a generic chart component
 */
@Component({
    selector: 'spice-chart',
    templateUrl: '../templates/spicechart.html',
})

export class SpiceChart implements  AfterViewInit {

    @ViewChild("chartcontainer") public chartContainer;

    /**
     * the chart itself
     * @private
     */
    private chart: any;



    constructor(
        public libLoader: libloader
    ) {
    }


    /**
     * load the necessary google libraries
     */
    public ngAfterViewInit() {
        this.loadNecessaryLibraries();
    }

    /**
     * load google maps library and call renderMap method
     * load cluster library and set the marker clusterer if the direction service is inactive
     */
    public loadNecessaryLibraries() {
        this.libLoader.loadLib('chartjs').subscribe(() => {
            this.renderchart();
        });
    }

    private renderchart(){
        const labels = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
        ];

        const data = {
            labels: labels,
            datasets: [{
                backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary'),
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                plugins:{
                    legend: {
                        display: false
                    },
                }
            }
        };

        this.chart = new Chart(
            this.chartContainer.nativeElement,
            config
        );
    }

}
