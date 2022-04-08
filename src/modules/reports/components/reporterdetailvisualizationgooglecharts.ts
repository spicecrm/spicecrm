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
    templateUrl: '../templates/reporterdetailvisualizationgooglecharts.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporterDetailVisualizationGooglecharts implements AfterViewInit, OnDestroy {
    /**
     * save the visualization data
     */
    public vizdata: any = {};
    /**
     * save the google chart wrapper instance
     */
    public wrapper: any = undefined;
    /**
     * save the resize event listener
     */
    public resizeHandler: any = {};

    constructor(public renderer: Renderer2,
                public elementRef: ElementRef,
                public metadata: metadata,
                public zone: NgZone,
                public libloader: libloader) {

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
    public loadGoogleChart() {
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
    public drawchart() {
        this.wrapper = new google.visualization.ChartWrapper(this.vizdata.data);
        this.wrapper.draw();
    }

    /**
     * redraw the chart on resize
     */
    public onResize() {
        if (this.wrapper) {
            this.zone.runOutsideAngular(() => {
                this.wrapper.draw();
            });
        }
    }
}
