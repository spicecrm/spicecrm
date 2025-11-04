/**
 * @module AdminComponentsModule
 */
import { Component, OnInit } from '@angular/core';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';
import { take } from 'rxjs/operators';
import { language } from '../../services/language.service';
import {configurationService} from "../../services/configuration.service";

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'administration-password-config',
    templateUrl: '../templates/administrationpasswordconfig.html',
    standalone: false
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
        pwdvaliditydays: 0,
        send_password_channel: undefined,
        send_password_channel_mailbox_id: undefined,
        send_username_channel: undefined,
        send_username_channel_mailbox_id: undefined,
    };

    public configBackup: any;
    /**
     * holds the available mailboxes
     */
    public mailboxes: {id: string, name: string, outbound_comm: string}[] = [];

    constructor( public backend: backend,
                 public modal: modal,
                 public toast: toast,
                 public configurationService: configurationService,
                 public language: language ) {
        this.loadMailboxes();
    }

    /**
     * @return array channel mailboxes
     */
    get passwordChannelMailboxes(){
        if (!this.config.send_password_channel) return [];
        const channelExt = this.config.send_password_channel === 'sms' ? '_sms' : '';
        return this.mailboxes.filter(m => m.outbound_comm == `single${channelExt}` || m.outbound_comm == `mass${channelExt}`);
    }

    /**
     * @return array channel mailboxes
     */
    get usernameChannelMailboxes(){
        if (!this.config.send_username_channel) return [];
        const channelExt = this.config.send_username_channel === 'sms' ? '_sms' : '';
        return this.mailboxes.filter(m => m.outbound_comm == `single${channelExt}` || m.outbound_comm == `mass${channelExt}`);
    }

    /**
     * load mailboxes
     */
    public loadMailboxes() {
        this.isLoading = true;
        this.backend.getRequest("module/Mailboxes", {limit: -99}).subscribe(
            (results: {list: {id: string, name: string, outbound_comm: string}[]}) => {
                this.mailboxes = results.list.sort((a, b) => a.name.localeCompare(b.name));
                this.isLoading = false;
            });
    }

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
            pwdvaliditydays: this.config.pwdvaliditydays,
            send_password_channel: this.config.send_password_channel,
            send_password_channel_mailbox_id: this.config.send_password_channel_mailbox_id,
            send_username_channel: this.config.send_username_channel,
            send_username_channel_mailbox_id: this.config.send_username_channel_mailbox_id,
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
                this.config.minpwdlength = parseInt( response.minpwdlength, 10 ) || 0;
                this.config.pwdvaliditydays = parseInt( response.pwdvaliditydays, 10 ) || 0;
                this.config.send_password_channel = response.send_password_channel;
                this.config.send_password_channel_mailbox_id = response.send_password_channel_mailbox_id;
                this.config.send_username_channel = response.send_username_channel;
                this.config.send_username_channel_mailbox_id = response.send_username_channel_mailbox_id;
                this.configBackup = JSON.parse( JSON.stringify( this.config ) );
                this.isLoading = false;
            });
    }

}
