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
            this.backend.getRequest('configuration/systemstats', {summary: true}).subscribe(stats => {
                if(this.limits.database > 0){
                    this.usage.database = Math.round(stats.database.size/ 1024 / 1000 / this.limits.database * 100);
                }
            });
        }
    }

}
