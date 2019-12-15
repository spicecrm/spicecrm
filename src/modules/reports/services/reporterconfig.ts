/**
 * @module ModuleReports
 */
import {Injectable, EventEmitter} from '@angular/core';
import {configurationService} from '../../../services/configuration.service';
import {backend} from '../../../services/backend.service';


@Injectable()
export class reporterconfig {

    userFilters: Array<any> = [];
    defaultUserFilters: string = '';

    operatorCount: any = {};
    operatorTypes: any = {};
    operatorAssignments: any = {};

    refresh$: EventEmitter<any> = new EventEmitter<any>()

    constructor(private configurationService: configurationService, private backend: backend) {
        let repConfig = this.configurationService.getData('reporterConfig');
        if (!repConfig) {
            this.backend.getRequest('KReporter/core/whereoperators/all').subscribe(repConfig => {
                this.configurationService.setData('reporterConfig', repConfig);
                this.parseConfifg(repConfig);
            })
        } else {
            this.parseConfifg(repConfig);
        }
    }

    parseConfifg(repConfig) {
        this.operatorCount = repConfig.operatorCount;
        this.operatorTypes = repConfig.operatorTypes;
        this.operatorAssignments = repConfig.operatorAssignments;
    }

    public refresh() {
        this.refresh$.emit(true);
    }

    resetUserFilters() {
        this.userFilters = [];
        this.defaultUserFilters = '[]';
    }

    addUserFilter(filter) {
        this.userFilters.push(filter);
        this.defaultUserFilters = JSON.stringify(this.userFilters);
    }

    setDefaultUserFilter() {
        this.userFilters = JSON.parse(this.defaultUserFilters);
        this.refresh();
    }

    setSavedFilter(filtervalues) {
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
            })
        }
        this.refresh();
    }
}