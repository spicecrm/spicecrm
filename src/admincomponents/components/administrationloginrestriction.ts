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
 * @module AdminComponentsModule
 */
import { Component, OnInit } from '@angular/core';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { take } from 'rxjs/operators';

/**
 * @ignore
 */
declare var _: any;

/**
 * the api log viwer rendered as part of the admin setion in the system
 */
@Component({
    selector: 'administration-login-restriction',
    templateUrl: './src/admincomponents/templates/administrationloginrestriction.html'
})
export class AdministrationLoginRestriction implements OnInit {

    /**
     * inidcates that we are loading
     * @private
     */
    private isLoading = true;

    private restrictions = {
        user: {
            enabled: false,
            number_attempts: 0,
            monitored_period: 0,
            blocking_duration: 0,
            blocking_type: 'permanent'
        },
        ip: {
            enabled: false,
            number_attempts: 0,
            monitored_period: 0
        }
    };
    private restrictionsBackup: any;

    constructor( private backend: backend, private toast: toast ) { }

    public ngOnInit() {
        this.loadConfig();
    }

    private isDirty() {
        return !_.isEqual( this.restrictions, this.restrictionsBackup );
    }

    private cancelEditing() {
        this.restrictions = JSON.parse(JSON.stringify( this.restrictionsBackup ));
    }

    private saveConfig() {
        let config = {
            ip_enabled: this.restrictions.ip.enabled ? 1:0,
            ip_number_attempts: this.restrictions.ip.number_attempts,
            ip_monitored_period: this.restrictions.ip.monitored_period,
            user_enabled: this.restrictions.user.enabled ? 1:0,
            user_number_attempts: this.restrictions.user.number_attempts,
            user_monitored_period: this.restrictions.user.monitored_period,
            user_blocking_duration: this.restrictions.user.blocking_type === 'time' ? this.restrictions.user.blocking_duration : '0',
        };
        this.isLoading = true;
        this.backend.postRequest('configuration/configurator/editor/login_attempt_restriction', null, { config: config })
            .pipe(take(1))
            .subscribe( response => {
                this.restrictionsBackup = JSON.parse(JSON.stringify( this.restrictions ));
                this.toast.sendToast( 'Login Restriction Configuration successfully saved.', 'success' );
                this.isLoading = false;
            });
    }

    private loadConfig() {
        this.isLoading = true;
        this.backend.getRequest('configuration/configurator/editor/login_attempt_restriction')
            .pipe(take(1))
            .subscribe(response => {
                this.restrictions.ip.enabled = response.ip_enabled === '1' || false;
                this.restrictions.ip.number_attempts = response.ip_number_attempts*1 || 0,
                this.restrictions.ip.monitored_period = response.ip_monitored_period*1 || 0,
                this.restrictions.user.enabled = response.user_enabled === '1' || false;
                this.restrictions.user.number_attempts = response.user_number_attempts*1 || 0,
                this.restrictions.user.monitored_period = response.user_monitored_period*1 || 0,
                this.restrictions.user.blocking_duration = response.user_blocking_duration*1 || 0;
                this.restrictions.user.blocking_type = this.restrictions.user.blocking_duration ? 'time':'permanent';
                this.restrictionsBackup = JSON.parse( JSON.stringify( this.restrictions ) );
                this.isLoading = false;
            },
                error => {
                this.toast.sendToast('Error loading Login Restriction Config.','error');
                this.isLoading = false;
            });
    }

}
