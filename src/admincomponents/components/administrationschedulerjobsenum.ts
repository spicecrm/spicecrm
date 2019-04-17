/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {Router} from "@angular/router";

@Component({
    selector: 'administration-scheduler-jobs-enum',
    templateUrl: './src/admincomponents/templates/administrationschedulerjobsenum.html'
})
export class AdministrationSchedulerJobsEnum {
    jobsList: any[] = [];

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public backend: backend) {
        this.backend.getRequest('module/Scheduler/jobslist').subscribe(jobslist => this.jobsList = Object.keys(jobslist));
    }

    private trackByFn(index, item) {
        return index;
    }
}
