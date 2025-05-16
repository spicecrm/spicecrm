/**
 * @module ModuleProcessManagemnent
 */
import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {configurationService} from '../../../services/configuration.service';
import {BehaviorSubject} from "rxjs";

declare var _: any;

@Injectable()
export class processmanagement {

    /**
     * keep the process groups
     */
    public processGroups: any[] = [];

    /**
     * the company code id .. if set it is memorized
     */
    public companyCodeId: string;

    constructor(
        public backend: backend
    ) {

    }

    /**
     * get the process groups
     *
     * @param companycodeId
     */
    public getProcessGroups(companycodeId = null){
        if(companycodeId) {
            this.companyCodeId = companycodeId;
        }
        if(this.companyCodeId) {
            this.processGroups = [];
            this.backend.getRequest(`module/CompanyCodes/${this.companyCodeId}/related/processmgmtgroups`, {limit: '-99', forceResolveLinks: true}).subscribe({
                next: (related) => {
                    for (let id in related) {
                        this.processGroups.push(related[id]);
                    }
                }
            })
        }
    }
}
