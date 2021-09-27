/**
 * @module WorkbenchModule
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
    selector: 'password-config',
    templateUrl: './src/admincomponents/templates/passwordconfig.html'
})
export class PasswordConfig implements OnInit {

    /**
     * inidcates that we are loading
     * @private
     */
    private isLoading = true;

    private config = {
        minpwdlength: 6,
        oneupper: true,
        onelower: true,
        onenumber: true,
        pwdexpirationdays: 0,
        pwdexpirationwarningdays: 0
    };

    private configBackup: any;

    constructor( private backend: backend, private modal: modal, private toast: toast, private language: language ) { }

    private configIsDirty() {
        return !_.isEqual( this.config, this.configBackup );
    }

    private cancel() {
        this.config = JSON.parse(JSON.stringify( this.configBackup ));
    }

    private save() {
        let config = {
            minpwdlength: this.config.minpwdlength,
            oneupper: this.config.oneupper ? '1':'0',
            onelower: this.config.onelower ? '1':'0',
            onenumber: this.config.onenumber ? '1':'0',
            pwdexpirationdays: this.config.pwdexpirationdays,
            pwdexpirationwarningdays: this.config.pwdexpirationwarningdays
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

    private loadConfig() {
        this.isLoading = true;
        this.backend.getRequest('configuration/configurator/editor/passwordsetting')
            .pipe(take(1))
            .subscribe(response => {
                this.config.oneupper = response.oneupper === true || response.oneupper === 1 || response.oneupper === '1' || false;
                this.config.onelower = response.onelower === true || response.onelower === 1 || response.onelower === '1' || false;
                this.config.onenumber = response.onenumber === true || response.onenumber === 1 || response.onenumber === '1' || false;
                this.config.minpwdlength = parseInt( response.minpwdlength, 10 ) || 0,
                this.config.pwdexpirationdays = parseInt( response.pwdexpirationdays, 10 ) || 0,
                this.config.pwdexpirationwarningdays = parseInt( response.pwdexpirationwarningdays, 10 ) || 0,
                this.configBackup = JSON.parse( JSON.stringify( this.config ) );
                this.isLoading = false;
            });
    }

}
