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
 * @module GlobalComponents
 */
import {Component, OnInit} from '@angular/core';
import {configurationService} from '../../../services/configuration.service';
import {backend} from '../../../services/backend.service';

declare var moment: any;

/**
 * displays the days let in trial resp subscription
 */
@Component({
    selector: 'systemtenant-header-bar-summary',
    templateUrl: './src/modules/systemtenants/templates/systemtenantheaderbarsummary.html'
})
export class SystemTenantHeaderBarSummary implements OnInit {

    private usage = {
        database: 0,
        elastic: 0,
        uploadfiles: 0,
        users: 0
    };

    private limits = {
        database: 0,
        elastic: 0,
        uploadfiles: 0,
        users:0
    };

    constructor(private configuration: configurationService, private backend: backend) {

    }

    public ngOnInit() {
        this.getConfig();
        this.getStats();
    }

    /**
     * loads the conmfig limits
     *
     * @private
     */
    private getConfig(){
        let config = this.configuration.getData('tenantconfig');
        this.limits.database = config.limit_database ? parseInt(config.limit_database, 10) : 0;
        this.limits.elastic = config.limit_elastic ? config.limit_elastic : 0;
        this.limits.uploadfiles = config.limit_uploads ? config.limit_uploads : 0;
        this.limits.users = config.limit_users ? config.limit_users : 0;
    }

    /**
     * retrives actual values
     *
     * @private
     */
    private getStats() {
        if(this.limits.database > 0 ||this.limits.elastic > 0 ||this.limits.users > 0 ||this.limits.uploadfiles > 0) {
            this.backend.getRequest('admin/systemstats', {summary: true}).subscribe(stats => {
                if(this.limits.database > 0){
                    this.usage.database = Math.round(stats.database.size/ 1024 / 1000 / this.limits.database * 100);
                }
            });
        }
    }

}
