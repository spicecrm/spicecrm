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

    @Input() public id: string = '';
    @Input() public config: any = undefined;
    @Input() public parentModule: string = '';
    @Input() public parentId: string = '';
    public componentconfig: any = {};
    public hasVisualization: boolean = false;
    public vizData: any = {};

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
