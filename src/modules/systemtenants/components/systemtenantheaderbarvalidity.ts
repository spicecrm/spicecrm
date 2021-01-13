/**
 * @module GlobalComponents
 */
import {Component, OnInit} from '@angular/core';
import {configurationService} from '../../../services/configuration.service';

declare var moment: any;

/**
 * displays the days let in trial resp subscription
 */
@Component({
    selector: 'systemtenant-header-bar-validity',
    templateUrl: './src/modules/systemtenants/templates/systemtenantheaderbarvalidity.html'
})
export class SystemTenantHeaderBarValidity implements OnInit {

    /**
     * indicates if the tenant is in trial mode
     *
     * @private
     */
    private isTrial: boolean = false;

    /**
     * indicates that the tentnat has an expiration date
     * @private
     */
    private hasExpiration: boolean = false;

    /**
     * the number of days left in the trial
     * @private
     */
    private daysLeft: number;

    constructor(private configuration: configurationService) {

    }

    public ngOnInit() {
        this.getExpiration();

        this.getTrial();

        if (this.hasExpiration) {
            this.getDaysLeft();
        }
    }

    /**
     * get the trial state
     * @private
     */
    private getTrial() {
        let configData = this.configuration.getData('tenantconfig');
        this.isTrial = configData?.is_trial == '1';
    }

    /**
     * checks if the tentnat has a validity date
     */
    private getExpiration() {
        let configData = this.configuration.getData('tenantconfig');
        this.hasExpiration = !!configData?.valid_until;
    }

    private getDaysLeft() {
        let validity = new moment(this.configuration.getData('tenantconfig').valid_until);
        let duration = moment.duration(validity.diff(new moment()));
        this.daysLeft = Math.round(duration.as('days'));
    }

}
