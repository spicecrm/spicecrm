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
    selector: 'administration-password-config',
    templateUrl: '../templates/administrationpasswordconfig.html'
})
export class AdministrationPasswordConfig implements OnInit {

    /**
     * inidcates that we are loading
     * @private
     */
    public isLoading = true;

    public config = {
        minpwdlength: 6,
        oneupper: true,
        onelower: true,
        onenumber: true,
        onespecial: true,
        pwdvaliditydays: 0
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
            minpwdlength: this.config.minpwdlength,
            oneupper: this.config.oneupper ? '1':'0',
            onelower: this.config.onelower ? '1':'0',
            onenumber: this.config.onenumber ? '1':'0',
            onespecial: this.config.onespecial ? '1':'0',
            pwdvaliditydays: this.config.pwdvaliditydays
        };
        this.isLoading = true;
        this.backend.postRequest('configuration/configurator/editor/passwordsetting', null, { config: config })
            .pipe(take(1))
            .subscribe( response => {
                this.configBackup = JSON.parse(JSON.stringify( this.config ));
                this.toast.sendToast( 'Password Configuration successfully saved.', 'success' );
                this.isLoading = false;
            });
    }

    public ngOnInit() {
        this.loadConfig();
    }

    public loadConfig() {
        this.isLoading = true;
        this.backend.getRequest('configuration/configurator/editor/passwordsetting')
            .pipe(take(1))
            .subscribe(response => {
                this.config.oneupper = response.oneupper === true || response.oneupper === 1 || response.oneupper === '1' || false;
                this.config.onelower = response.onelower === true || response.onelower === 1 || response.onelower === '1' || false;
                this.config.onenumber = response.onenumber === true || response.onenumber === 1 || response.onenumber === '1' || false;
                this.config.onespecial = response.onespecial === true || response.onespecial === 1 || response.onespecial === '1' || false;
                this.config.minpwdlength = parseInt( response.minpwdlength, 10 ) || 0,
                this.config.pwdvaliditydays = parseInt( response.pwdvaliditydays, 10 ) || 0,
                this.configBackup = JSON.parse( JSON.stringify( this.config ) );
                this.isLoading = false;
            });
    }

}
