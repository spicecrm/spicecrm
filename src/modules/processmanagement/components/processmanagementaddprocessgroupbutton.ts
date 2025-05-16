/**
 * @module ModulePriceConditions
 */
import {Component, Input, OnInit, SkipSelf} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {processmanagement} from "../services/processmanagement.service";

@Component({
    selector:'process-management-add-processgroup-button',
    templateUrl: '../templates/processmanagementaddprocessgroupbutton.html',
    providers: [model]
})
export class ProcessManagementAddProcessGroupButton {

    /**
     * the process category
     */
    @Input() public processCategory: any;

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

    public addGroup(){
        this.model.module = 'ProcessMGMTGroups';
        this.model.id = null;
        this.model.addModel(null, this.parent, {companycode_id: this.parent.id, processmgmtcategory_id: this.processCategory.id, processmgmtcategory_name: this.processCategory.name, processmgmtcategory_linked: this.processCategory}).subscribe({
            next: (added) => {
                if(added){
                    this.processmanagement.getProcessGroups();
                }
            }
        });
    }
}
