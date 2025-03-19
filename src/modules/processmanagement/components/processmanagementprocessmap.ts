/**
 * @module ModulePriceConditions
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {processmanagement} from "../services/processmanagement.service";


declare var _: any;

@Component({
    selector:'process-management-process-map',
    templateUrl: '../templates/processmanagementprocessmap.html',
    providers: [processmanagement]
})
export class ProcessManagementProcessMap implements OnInit {

    /**
     *  a componentconfig passed in
     */
    public componentconfig: any = {};

    /**
     * inidcates that the panel is loading
     */
    public loading: boolean = true;

    public processCategories: any[] = [];


    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public router: Router,
        public backend: backend,
        public configuration: configurationService,
        public processmanagement: processmanagement
    ) {

    }

    public ngOnInit() {
        this.getCategories();

        this.loadProcessGroups();
    }

    public getCategories(){
        // get the categories
        this.backend.getRequest('module/ProcessMGMTCategories').subscribe({
            next: (processCategories) => {
                this.processCategories = processCategories.list;
            }
        });
    }

    public loadProcessGroups(){
        this.processmanagement.getProcessGroups(this.model.id);
    }


}
