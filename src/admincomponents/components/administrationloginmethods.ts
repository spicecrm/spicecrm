/**
 * @module AdminComponentsModule
 */
import { Component, OnInit } from '@angular/core';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';

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
    /**
     * holds the available mailboxes
     */
    public mailboxes: {id: string, name: string}[] = [];

    public config: {
        twoFactorAuthMethod: 'sms' | 'one_time_password' | 'email',
        trustDeviceDays: string,
        smsMailboxId: string,
        emailMailboxId: string,
        requireOn: 'always' | 'device_change' | ''
    } = {
        twoFactorAuthMethod: 'one_time_password',
        smsMailboxId: undefined,
        emailMailboxId: undefined,
        requireOn: '',
        trustDeviceDays: '90',
    };

    public configBackup: any;

    constructor( public backend: backend,
                 public toast: toast ) { }

    public cancel() {
        this.config = JSON.parse(JSON.stringify( this.configBackup ));
    }

    /**
     * save the 2FA config
     */
    public save() {

        if (['sms', 'email'].indexOf(this.config.twoFactorAuthMethod) > -1 && !this.config[`${this.config.twoFactorAuthMethod}MailboxId`]) {
            this.toast.sendToast('LBL_MAILBOX_REQUIRED', 'error');
            return;
        }

        if (Number(this.config.trustDeviceDays) > 365) {
            this.config.trustDeviceDays = '365'
        }

        if (Number(this.config.trustDeviceDays) < 1) {
            this.config.trustDeviceDays = '1'
        }

        const config = {
            'method': this.config.twoFactorAuthMethod,
            'sms_mailbox_id': this.config.smsMailboxId,
            'email_mailbox_id': this.config.emailMailboxId,
            'trust_device_days': this.config.trustDeviceDays,
            'require_on': this.config.requireOn,
        };

        this.isLoading = true;

        this.backend.postRequest('configuration/configurator/editor/user_login_2fa', null, { config: config })
            .subscribe( () => {
                this.configBackup = JSON.parse(JSON.stringify( this.config ));
                this.toast.sendToast( 'Login Method Configuration successfully saved.', 'success' );
                this.isLoading = false;
            });
    }

    public ngOnInit() {
        this.loadConfig();
        this.loadMailboxes();
    }

    /**
     * load config
     */
    public loadConfig() {

        this.isLoading = true;

        this.backend.getRequest('configuration/configurator/editor/user_login_2fa')
            .subscribe(response => {
                this.config.twoFactorAuthMethod = response.method;
                this.config.requireOn = response.require_on ?? '';
                this.config.smsMailboxId = response.sms_mailbox_id;
                this.config.emailMailboxId = response.email_mailbox_id;
                this.config.trustDeviceDays = response.trust_device_days;
                this.configBackup = JSON.parse( JSON.stringify( this.config ) );
                this.isLoading = false;
            });
    }

    /**
     * load mailboxes
     */
    public loadMailboxes() {
        this.isLoading = true;
        this.backend.getRequest("module/Mailboxes").subscribe(
            (results: {list: {id: string, name: string}[]}) => {
                this.mailboxes = results.list.sort((a, b) => a.name.localeCompare(b.name));
                this.isLoading = false;
            });
    }

    /**
     * reset other configs to default values 
     */
    public handleRequireOnChange() {
        this.config.twoFactorAuthMethod = 'one_time_password';
        this.config.trustDeviceDays = '90';
    }
}
