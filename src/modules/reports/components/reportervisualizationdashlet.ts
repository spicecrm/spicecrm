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
    templateUrl: './src/modules/reports/templates/reportervisualizationdashlet.html',
    providers: [model, reporterconfig]
})
export class ReporterVisualizationDashlet implements OnInit, AfterViewInit {

    @Input() private id: string = '';
    @Input() private config: any = undefined;
    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    private componentconfig: any = {};
    private hasVisualization: boolean = false;
    private vizData: any = {};

    /**
     * emit if a no access or not found error has been raised by the backend
     * allows to hide the container for the report dashlet
     */
    @Output() private noAccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private model: model, private reporterconfig: reporterconfig) {
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
