/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleReportsDesignerMore
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {ReportsDesignerService} from "../../../modules/reportsdesigner/services/reportsdesigner.service";

@Component({
    selector: 'reports-designer-more-integrate-item-schedule',
    templateUrl: './src/modules/reportsdesignermore/templates/reportsdesignermoreintegrateitemschedule.html'
})
export class ReportsDesignerMoreIntegrateItemSchedule {

    protected dLists: any[] = [];
    private expandedId: string = '';

    constructor(private language: language,
                private model: model,
                private modal: modal,
                private backend: backend,
                private reportsDesignerService: ReportsDesignerService) {
    }

    get schedules() {
        return this.model.getField('integration_params').kscheduling;
    }

    /**
     * initialize the plugin properties
     */
    public ngOnInit() {
        this.initializeProperties();
        this.loadDLists();
    }

    /**
     * set the initial plugin properties
     */
    private initializeProperties() {
        const integrationParams = this.model.getField('integration_params');
        if (!integrationParams.kscheduling) {
            integrationParams.kscheduling = [];
            this.model.setField('integration_params', integrationParams);
        }
    }

    /**
     * load dLists from backend
     */
    private loadDLists() {
        this.backend.getRequest('KReporter/dlistmanager/dlists').subscribe(dLists => {
            if (!!dLists) this.dLists = dLists;
        });
    }

    /**
     * @return newSchedule: object
     */
    private generateSchedule() {
        const guid = this.reportsDesignerService.generateGuid();
        return {
            id: guid,
            schedulerid: guid,
            day: '*',
            month: '*',
            weekday: '*',
            hrs: '*',
            min: '*',
            scheduleraction: '',
            schedulersavetoaction: '',
            schedulersendlist: '',
            schedulersendto: '',
            schedulersaveto: ''
        };
    }

    /**
     * add new schedule to the kscheduling list
     */
    private addSchedule() {
        const integrationParams = this.model.getField('integration_params');
        integrationParams.kscheduling = [...this.schedules, this.generateSchedule()];
        this.model.setField('integration_params', integrationParams);
    }

    /**
     * delete the schedule with the given id
     * @param scheduleId: string
     */
    private deleteSchedule(scheduleId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                const integrationParams = this.model.getField('integration_params');
                integrationParams.kscheduling = this.schedules.slice().filter(schedule => schedule.id != scheduleId);
                this.model.setField('integration_params', integrationParams);
            }
        });
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.id;
    }

    /**
     * toggle expansion
     * @param scheduleId: object
     */
    private toggleExpandSchedule(scheduleId) {
        this.expandedId = this.expandedId == scheduleId ? '' : scheduleId;
    }
}
