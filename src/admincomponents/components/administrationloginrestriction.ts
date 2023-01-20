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
    templateUrl: '../templates/administrationloginrestriction.html'
})
export class AdministrationLoginRestriction implements OnInit {

    /**
     * inidcates that we are loading
     * @private
     */
    public isLoading = true;

    public restrictions = {
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
    public restrictionsBackup: any;

    constructor( public backend: backend, public toast: toast ) { }

    public ngOnInit() {
        this.loadConfig();
    }

    public isDirty() {
        return !_.isEqual( this.restrictions, this.restrictionsBackup );
    }

    public cancelEditing() {
        this.restrictions = JSON.parse(JSON.stringify( this.restrictionsBackup ));
    }

    public saveConfig() {
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

    public loadConfig() {
        this.isLoading = true;
        this.backend.getRequest('configuration/configurator/editor/login_attempt_restriction')
            .pipe(take(1))
            .subscribe({
                next: response => {
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
                error: error => {
                    this.toast.sendToast('Error loading Login Restriction Config.','error');
                    this.isLoading = false;
                }
            });
    }

}
