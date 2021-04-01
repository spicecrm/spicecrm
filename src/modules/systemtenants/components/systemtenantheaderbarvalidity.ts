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
