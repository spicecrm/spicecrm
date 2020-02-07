/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'reports-designer-integrate-item-schedule',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrateitemschedule.html'
})
export class ReportsDesignerIntegrateItemSchedule {

    constructor(private language: language,
                private model: model,
                private modal: modal,
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
}
