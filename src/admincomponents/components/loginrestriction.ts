/**
 * @module WorkbenchModule
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
    selector: 'login-restriction',
    templateUrl: './src/admincomponents/templates/loginrestriction.html'
})
export class LoginRestriction implements OnInit {

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
            blocking_duration: 0
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
            ip_enabled: this.restrictions.ip.enabled ? '1':'0',
            ip_number_attempts: this.restrictions.ip.number_attempts,
            ip_monitored_period: this.restrictions.ip.monitored_period,
            user_enabled: this.restrictions.user.enabled ? '1':'0',
            user_number_attempts: this.restrictions.user.number_attempts,
            user_monitored_period: this.restrictions.user.monitored_period,
            user_blocking_duration: this.restrictions.user.blocking_duration
        };
        this.isLoading = true;
        this.backend.postRequest('configuration/configurator/editor/login_attempt_restriction', null, { config: config })
            .pipe(take(1))
            .subscribe( response => {
                this.restrictionsBackup = JSON.parse(JSON.stringify( this.restrictions ));
                this.isLoading = false;
            });
    }

    private loadConfig() {
        this.isLoading = true;
        this.backend.getRequest('configuration/configurator/editor/login_attempt_restriction')
            .pipe(take(1))
            .subscribe(response => {
                this.restrictions.ip.enabled = response.ip_enabled === '1' || false;
                this.restrictions.ip.number_attempts = response.ip_number_attempts || 0,
                this.restrictions.ip.monitored_period = response.ip_monitored_period || 0,
                this.restrictions.user.enabled = response.user_enabled === '1' || false;
                this.restrictions.user.number_attempts = response.user_number_attempts || 0,
                this.restrictions.user.monitored_period = response.user_monitored_period || 0,
                this.restrictions.user.blocking_duration = response.user_blocking_duration || 0;
                this.restrictionsBackup = JSON.parse( JSON.stringify( this.restrictions ) );
                this.isLoading = false;
            },
                error => {
                this.toast.sendToast('Error loading Login Restriction Config.','error');
                this.isLoading = false;
            });
    }

}
