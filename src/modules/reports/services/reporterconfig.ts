/**
 * @module ModuleReports
 */
import {Injectable, EventEmitter} from '@angular/core';
import {configurationService} from '../../../services/configuration.service';
import {backend} from '../../../services/backend.service';


/**
 * a helper service to handle the reporter
 */
@Injectable()
export class reporterconfig {

    public userFilters: any[] = [];
    public whereFunctions: any[] = [];
    public defaultUserFilters: string = '';

    public operatorCount: any = {};
    public operatorTypes: any = {};
    public operatorAssignments: any = {};

    /**
     * emits when the report shoudl refresh
     */
    public refresh$: EventEmitter<any> = new EventEmitter<any>()

    /**
     * loads the operators and stores them in the config .. if they are loaded they are retirved from the config
     *
     * @param configurationService
     * @param backend
     */
    constructor(public configurationService: configurationService, public backend: backend) {
        let repConfig = this.configurationService.getData('reporterConfig');
        if (!repConfig) {
            this.backend.getRequest('module/KReports/core/whereoperators/all').subscribe(repConfig => {
                this.configurationService.setData('reporterConfig', repConfig);
                this.parseConfifg(repConfig);
            });
        } else {
            this.parseConfifg(repConfig);
        }

        this.getWhereFunctions();
    }

    public getWhereFunctions() {
        this.backend.getRequest('module/KReports/core/wherefunctions').subscribe(res => {
           this.whereFunctions = res;
        });
    }

    /**
     * parse the config from the backend and
     *
     * @param repConfig
     */
    public parseConfifg(repConfig) {
        this.operatorCount = repConfig.operatorCount;
        this.operatorTypes = repConfig.operatorTypes;
        this.operatorAssignments = repConfig.operatorAssignments;
    }

    /**
     * trigger a refresh
     */
    public refresh() {
        this.refresh$.emit(true);
    }

    public resetUserFilters() {
        this.userFilters = [];
        this.defaultUserFilters = '[]';
    }

    public addUserFilter(filter) {
        this.userFilters.push(filter);
        this.defaultUserFilters = JSON.stringify(this.userFilters);
    }

    public setDefaultUserFilter() {
        this.userFilters = JSON.parse(this.defaultUserFilters);
        this.refresh();
    }

    /**
     * set a saved filter
     *
     * @param filtervalues
     */
    public setSavedFilter(filtervalues) {
        for (let filtervalue of filtervalues) {
            this.userFilters.some(userfilter => {
                if (userfilter.fieldid == filtervalue.fieldid) {
                    userfilter.operator = filtervalue.operator;
                    userfilter.value = filtervalue.value;
                    userfilter.valuekey = filtervalue.valuekey;
                    userfilter.valueto = filtervalue.valueto;
                    userfilter.valuetokey = filtervalue.valuetokey;
                    return true;
                }
            });
        }
        this.refresh();
    }
}
