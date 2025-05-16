/**
 * @module ModuleProcessManagement
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {processmanagement} from "../services/processmanagement.service";




@Component({
    selector:'process-management-process-map-dashlet',
    templateUrl: '../templates/processmanagementprocessmapdashlet.html',
    providers: [model]
})
export class ProcessManagementProcessMapDashlet implements OnInit {

    constructor(
        public model: model,
        public backend: backend
    ) {
        this.model.module = 'CompanyCodes';
    }

    public ngOnInit() {
        // get the companycodes
        this.backend.getRequest(`module/${this.model.module}`).subscribe({
            next: (companyCodes) => {
                if(companyCodes.list.length > 0){
                    this.model.id = companyCodes.list[0].id;
                    this.model.initializeModel();
                    this.model.setData(companyCodes.list[0]);
                }
            }
        })
    }

}
