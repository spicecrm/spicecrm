/**
 * @module ModulePriceConditions
 */
import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {processmanagement} from "../services/processmanagement.service";
import {view} from "../../../services/view.service";

@Component({
    selector:'process-management-process-group',
    templateUrl: '../templates/processmanagementprocessgroup.html',
    providers: [view]
})
export class ProcessManagementProcessGroup implements OnInit{

    /**
     * the process category
     */
    @Input() public processGroup: any;

    /**
     * keep the process groups
     */
    public processes: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public router: Router,
        public backend: backend,
        public configuration: configurationService,
        public processmanagement: processmanagement,
        public view: view
    ) {
        view.isEditable = false;
        view.displayLabels = false;
    }

    public ngOnInit() {
        this.getProcesses();
    }

    public getProcesses(){
        this.processes = [];
        this.backend.getRequest(`module/ProcessMGMTGroups/${this.processGroup.id}/related/processmgmtprocesses`, {limit: '-99'}).subscribe({
            next: (related) => {
                for (let id in related) {
                    this.processes.push(related[id]);
                }
                this.processes.sort((a, b) => {return a.sequence_number > b.sequence_number ? 1 : -1;})
            }
        })
    }

}
