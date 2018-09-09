import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'reporter-visualization-container',
    templateUrl: './src/modules/reports/templates/reportervisualizationcontainer.html',
    styles:[
        ':host {width:100%; height: 300px;}'
    ]
})
export class ReporterVisualizationContainer implements OnInit, AfterViewInit {

    componentconfig: any = {};

    constructor(private model: model) {
    }

    ngOnInit() {
        this.componentconfig.parentBeanId = this.model.id;
        this.componentconfig.parentBeanModule = this.model.module;
    }

    ngAfterViewInit() {

    }
}