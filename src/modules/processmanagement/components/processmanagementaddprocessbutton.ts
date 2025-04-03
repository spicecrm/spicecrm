/**
 * @module ModuleProcessManagement
 */
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {processmanagement} from "../services/processmanagement.service";

@Component({
    selector:'process-management-add-process-button',
    templateUrl: '../templates/processmanagementaddprocessbutton.html',
    providers: [model]
})
export class ProcessManagementAddProcessButton {

    /**
     * the process category
     */
    @Input() public processGroup: any;

    @Output() public added: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        @SkipSelf() public parent: model,
        public router: Router,
        public backend: backend,
        public configuration: configurationService,
        public processmanagement: processmanagement
    ) {

    }

    public addProcess(){
        this.model.module = 'ProcessMGMTProcesses';
        this.model.id = null;
        this.model.addModel(null, this.parent, {companycode_id: this.processGroup.companycode_id, processmgmtgroup_id: this.processGroup.id, processmgmtgroup_name: this.processGroup.name, processmgmtgroup_linked: this.processGroup}).subscribe({
            next: (added) => {
                if(added){
                    this.added.emit(true);
                }
            }
        });
    }
}
