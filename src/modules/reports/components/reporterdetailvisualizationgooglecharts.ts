/**
 * @module ModuleReports
 */
import {
    Component, AfterViewInit, OnInit,
    OnDestroy, ElementRef, Renderer2
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {libloader} from '../../../services/libloader.service';

/**
 * @ignore
 */
declare var google: any;

@Component({
    selector: 'reporter-detail-visualization-googlecharts',
    templateUrl: './src/modules/reports/templates/reporterdetailvisualizationgooglecharts.html'
})
export class ReporterDetailVisualizationGooglecharts implements AfterViewInit, OnDestroy {

    private vizdata: any = {};
    private wrapper: any = undefined;
    private resizseHandler: any = {};

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private metadata: metadata, private libloader: libloader) {
        this.resizseHandler = this.renderer.listen('window', 'resize', () => this.onResize());
    }


    public ngAfterViewInit() {

        if (!this.vizdata.data.options.height) {
            this.vizdata.data.options.height = this.elementRef.nativeElement.height;
        }

        this.libloader.loadLib('googlecharts').subscribe((next) => {
            google.charts.load('current', {packages: ['corechart']});
            google.charts.setOnLoadCallback(() => {
                this.drawchart();
            });
        });
    }

    private drawchart() {
        this.wrapper = new google.visualization.ChartWrapper(this.vizdata.data);
        this.wrapper.draw();
    }

    public ngOnDestroy() {
        this.resizseHandler();
    }

    private getVizStyle() {
        return this.vizdata.layout;
    }

    private onResize() {
        if (this.wrapper) {
            this.wrapper.draw();
        }
    }
}
