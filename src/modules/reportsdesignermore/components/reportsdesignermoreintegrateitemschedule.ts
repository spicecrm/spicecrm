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
    templateUrl: '../templates/reportsdesignermoreintegrateitemschedule.html'
})
export class ReportsDesignerMoreIntegrateItemSchedule {

    public dLists: any[] = [];
    public expandedId: string = '';

    constructor(public language: language,
                public model: model,
                public modal: modal,
                public backend: backend,
                public reportsDesignerService: ReportsDesignerService) {
    }

    get schedules() {
        return this.model.getField('integration_params').kscheduling;
    }

    /**
     * set the cron expression fields from the expression object
     * @return string the schedule cron expression
     * @param schedule
     * @param expressionObject
     */
    public setCronExpression(schedule: { min: any; hrs: any; day: any; month: any; weekday: any; }, expressionObject: { minutes: any; hours: any; monthDay: any; month: any; weekDay: any; }) {
        schedule.min = expressionObject.minutes;
        schedule.hrs = expressionObject.hours;
        schedule.day = expressionObject.monthDay;
        schedule.month = expressionObject.month;
        schedule.weekday = expressionObject.weekDay;
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
    public initializeProperties() {
        const integrationParams = this.model.getField('integration_params');
        if (!integrationParams.kscheduling) {
            integrationParams.kscheduling = [];
            this.model.setField('integration_params', integrationParams);
        }
    }

    /**
     * load dLists from backend
     */
    public loadDLists() {
        this.backend.getRequest('module/KReports/dlistmanager/dlists').subscribe(dLists => {
            if (!!dLists) this.dLists = dLists;
        });
    }

    /**
     * @return newSchedule: object
     */
    public generateSchedule() {
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
    public addSchedule() {
        const integrationParams = this.model.getField('integration_params');
        integrationParams.kscheduling = [...this.schedules, this.generateSchedule()];
        this.model.setField('integration_params', integrationParams);
    }

    /**
     * delete the schedule with the given id
     * @param scheduleId: string
     */
    public deleteSchedule(scheduleId) {
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
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * toggle expansion
     * @param scheduleId: object
     */
    public toggleExpandSchedule(scheduleId) {
        this.expandedId = this.expandedId == scheduleId ? '' : scheduleId;
    }
}
