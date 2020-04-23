/**
 * @module ModuleReports
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    Renderer2
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {libloader} from '../../../services/libloader.service';

/** @ignore */
declare var google: any;

/**
 * handel displaying a google chart with the report data
 */
@Component({
    selector: 'reporter-detail-visualization-googlecharts',
    templateUrl: './src/modules/reports/templates/reporterdetailvisualizationgooglecharts.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailVisualizationGooglecharts implements AfterViewInit, OnDestroy {
    /**
     * save the visualization data
     */
    private vizdata: any = {};
    /**
     * save the google chart wrapper instance
     */
    private wrapper: any = undefined;
    /**
     * save the resize event listener
     */
    private resizeHandler: any = {};

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef,
                private metadata: metadata,
                private zone: NgZone,
                private libloader: libloader) {

        // listen to resize event to redraw the chart
        this.resizeHandler = this.renderer.listen('window', 'resize', () => this.onResize());
    }

    /**
     * call load google chart
     */
    public ngAfterViewInit() {

        this.loadGoogleChart();
    }

    /**
     * load google chart library and pass the report data to it
     */
    private loadGoogleChart() {
        if (!this.vizdata.data.options.height) {
            this.vizdata.data.options.height = this.elementRef.nativeElement.height;
        }

        this.libloader.loadLib('googlecharts').subscribe((next) => {
            this.zone.runOutsideAngular(() => {

                google.charts.load('current', {packages: ['corechart']});
                google.charts.setOnLoadCallback(() => {
                    this.drawchart();
                });

            });
        });
    }

    /**
     * remove resize listener
     */
    public ngOnDestroy() {
        this.resizeHandler();
    }

    /**
     * callback function for google to draw the chart
     */
    private drawchart() {
        this.wrapper = new google.visualization.ChartWrapper(this.vizdata.data);
        this.wrapper.draw();
    }

    /**
     * redraw the chart on resize
     */
    private onResize() {
        if (this.wrapper) {
            this.zone.runOutsideAngular(() => {
                this.wrapper.draw();
            });
        }
    }
}
