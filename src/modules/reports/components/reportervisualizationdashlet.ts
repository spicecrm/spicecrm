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
    selector: 'reporter-visualization-dashlet',
    templateUrl: './src/modules/reports/templates/reportervisualizationdashlet.html',
    providers: [model]
})
export class ReporterVisualizationDashlet implements OnInit, AfterViewInit {

    @Input() id: string = '';
    @Input() config: any = undefined;
    componentconfig: any = {};
    hasVisualization: boolean = false;
    vizData: any = {};

    constructor(private model: model) {
    }

    ngOnInit() {
        //if config was passed in as inut use it
        if(this.config)
            this.componentconfig = this.config;
    }

    ngAfterViewInit() {
        if (this.componentconfig.reportid !== '') {
            this.model.module = 'KReports';
            this.model.id = this.componentconfig.reportid;

            if(this.componentconfig.parentBeanId && this.componentconfig.parentBeanModule) {
                this.model['parentBeanId'] = this.componentconfig.parentBeanId;
                this.model['parentBeanModule'] = this.componentconfig.parentBeanModule;
            }

            this.model.getData().subscribe(data => {
                if (data.visualization_params != '') {
                    this.hasVisualization = true;
                }
            });
        }
    }
}