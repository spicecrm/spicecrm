/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import {model} from '../../../services/model.service';
import {reporterconfig} from '../services/reporterconfig';

@Component({
    selector: 'reporter-visualization-dashlet',
    templateUrl: '../templates/reportervisualizationdashlet.html',
    providers: [model, reporterconfig]
})
export class ReporterVisualizationDashlet implements OnInit, AfterViewInit {

    /**
     * the id of the repor
     */
    @Input() public id: string = '';

    /**
     * the confg
     */
    @Input() public config: any = undefined;

    /**
     * the parent module if displayed in a context
     */
    @Input() public parentModule: string = '';

    /**
     * the id of the parent model
     */
    @Input() public parentId: string = '';

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * internal marker to keep if the report has visualization at all
     */
    public hasVisualization: boolean = false;

    /**
     * emit if a no access or not found error has been raised by the backend
     * allows to hide the container for the report dashlet
     */
    @Output() public noAccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public model: model, public reporterconfig: reporterconfig) {
    }

    public ngOnInit() {
        if (this.config) {
            this.componentconfig = this.config;
        }
    }

    public ngAfterViewInit() {
        if (this.componentconfig.reportid !== '') {
            this.model.module = 'KReports';
            this.model.id = this.componentconfig.reportid;

            this.model.getData().subscribe(
                data => {
                    if (data.visualization_params != '') {
                        this.hasVisualization = true;
                    }
                },
                err => {
                    if (err.status == '403' || err.status == '404') {
                        this.noAccess.emit(true);
                    }
                });
        }
    }
}
