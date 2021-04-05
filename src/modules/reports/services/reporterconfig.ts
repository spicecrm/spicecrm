/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    constructor(private configurationService: configurationService, private backend: backend) {
        let repConfig = this.configurationService.getData('reporterConfig');
        if (!repConfig) {
            this.backend.getRequest('KReporter/core/whereoperators/all').subscribe(repConfig => {
                this.configurationService.setData('reporterConfig', repConfig);
                this.parseConfifg(repConfig);
            });
        } else {
            this.parseConfifg(repConfig);
        }

        this.getWhereFunctions();
    }

    private getWhereFunctions() {
        this.backend.getRequest('KReporter/core/wherefunctions').subscribe(res => {
           this.whereFunctions = res;
        });
    }

    /**
     * parse the config from the backend and
     *
     * @param repConfig
     */
    private parseConfifg(repConfig) {
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
