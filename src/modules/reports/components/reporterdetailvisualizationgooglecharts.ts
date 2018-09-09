import {
    Component, Input, AfterViewInit,  OnInit,
    OnDestroy, ElementRef, Renderer
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';

declare var google: any;

@Component({
    selector: 'reporter-detail-visualization-googlecharts',
    templateUrl: './app/modules/reports/templates/reporterdetailvisualizationgooglecharts.html',
    providers: [model]
})
export class ReporterDetailVisualizationGooglecharts implements AfterViewInit, OnInit, OnDestroy {

    vizdata: any = {};
    wrapper: any = undefined;
    resizseHandler: any = {};

    constructor(private renderer: Renderer, private broadcast: broadcast, private model: model, private backend: backend, private activatedRoute: ActivatedRoute, private navigation: navigation, private elementRef: ElementRef) {
        this.resizseHandler = this.renderer.listenGlobal('window', 'resize', () => this.onResize())
    }

    handleMessage(message: any) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

        if (!this.vizdata.data.options.height)
            this.vizdata.data.options.height = this.elementRef.nativeElement.height;

        //this.chart = new Highcharts.Chart(this.vizdata.data);
        if (google.visualization) {
            this.wrapper = new google.visualization.ChartWrapper(this.vizdata.data);
            this.wrapper.draw();
        }
    }

    ngOnDestroy() {
        this.resizseHandler();
    }

    getVizStyle() {
        return this.vizdata['layout'];
    }

    onResize() {
        if (this.wrapper)
            this.wrapper.draw();
    }

}