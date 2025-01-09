/**
 * @module ModuleReportsMore
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';

/**
 * displays reports as part of a parent
 */
@Component({
    selector: 'reporter-integration-parent-container',
    templateUrl: '../templates/reporterintegrationparentcontainer.html'
})
export class ReporterIntegrationParentContainer implements OnInit{

    /**
     * holds the reports
     */
    public reports: any[] = [];

    /**
     * a loading indicator
     */
    public isLoading: boolean = false;

    constructor(public backend: backend, public model: model) {
    }

    /**
     * on init load the reports
     */
    public ngOnInit() {
        this.isLoading = true;
        this.backend.getRequest(`module/KReports/plugins/kpublishing/reports/${this.model.module}`).subscribe({
            next: (reports) => {
                this.reports = reports.sort((a, b) => a.sequence > b.sequence ? -1 : 1);
                this.isLoading = false;
            },
            error: (e) => {
                this.isLoading = false;
            }
        })
    }

}
