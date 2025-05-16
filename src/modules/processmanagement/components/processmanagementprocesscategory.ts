/**
 * @module ModuleProcessManagement
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
    selector:'process-management-process-category',
    templateUrl: '../templates/processmanagementprocesscategory.html',
    providers: [view, model]
})
export class ProcessManagementProcessCategory implements OnInit{

    /**
     * the process category
     */
    @Input() public processCategory: any;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public view: view,
        public router: Router,
        public backend: backend,
        public configuration: configurationService,
        public processmanagement: processmanagement
    ) {
        view.isEditable = false;
        view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = 'ProcessMGMTCategories';
        this.model.id = this.processCategory.id;
        this.model.initialize();
        this.model.setData(this.processCategory);
    }

    get processGroups(){
        return this.processmanagement.processGroups.filter(pg => pg.processmgmtcategory_id == this.processCategory.id).sort((a, b) => {
            return a.sequence_number > b.sequence_number ? 1 : -1;
        });
    }
}
