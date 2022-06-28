/**
 * @module AdminComponentsModule
 */
import { Component, OnInit } from '@angular/core';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';
import { take } from 'rxjs/operators';
import { language } from '../../services/language.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'administration-login-methods',
    templateUrl: '../templates/administrationloginmethods.html'
})
export class AdministrationLoginMethods implements OnInit {

    /**
     * inidcates that we are loading
     * @private
     */
    public isLoading = true;

    public config = {
        totpAuthenticationRequired: false
    };

    public configBackup: any;

    constructor( public backend: backend, public modal: modal, public toast: toast, public language: language ) { }

    public configIsDirty() {
        return !_.isEqual( this.config, this.configBackup );
    }

    public cancel() {
        this.config = JSON.parse(JSON.stringify( this.configBackup ));
    }

    public save() {
        let config = {
            totp_authentication_required: this.config.totpAuthenticationRequired
        };
        this.isLoading = true;
        this.backend.postRequest('configuration/configurator/editor/login_methods', null, { config: config })
            .pipe(take(1))
            .subscribe( response => {
                this.configBackup = JSON.parse(JSON.stringify( this.config ));
                this.toast.sendToast( 'Login Method Configuration successfully saved.', 'success' );
                this.isLoading = false;
            });
    }

    public ngOnInit() {
        this.loadConfig();
    }

    public loadConfig() {
        this.isLoading = true;
        this.backend.getRequest('configuration/configurator/editor/login_methods')
            .pipe(take(1))
            .subscribe(response => {
                this.config.totpAuthenticationRequired = response.totp_authentication_required === true || response.totp_authentication_required === 1 || response.totp_authentication_required === '1' || false;
                this.configBackup = JSON.parse( JSON.stringify( this.config ) );
                this.isLoading = false;
            });
    }

}
