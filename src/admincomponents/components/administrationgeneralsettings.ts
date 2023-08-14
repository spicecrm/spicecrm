/**
 * @module AdminComponentsModule
 */
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {toast} from "../../services/toast.service";
import {currency} from "../../services/currency.service";

@Component({
    selector: 'administration-general-setting',
    templateUrl: '../templates/administrationgeneralsettings.html',
})

export class AdministrationGeneralSettings implements OnInit {
    /**
     * array to catch the settings
     */
    public settings: any = {
        system: {
            name: '',
            site_url: '',
            unique_key: ''
        },
        advanced: {
            developerMode: 0,
            stack_trace_errors: false,
            dump_slow_queries: false,
            slow_query_time_msec: 0,
            upload_maxsize: 0,
            international_email_addresses: 0
        },
        cache: {
            class: 'SpiceCacheFile',
            external_cache_disabled: false,
            redis_host: 'localhost',
            redis_port: 6379,
            memcached_host: 'localhost',
            memcached_port: 11211
        },
        logger: {
            level: '',
            file_name: 'spicecrm',
            file_ext: '',
            file_maxlogs: 10,
            file_maxsize: '10MB',
            file_suffix: ''
        }
    };

    /**
     * available options from backend
     */
    public options: any = [];

    /**
     * currencies
     */

    public currencies: any = [];
    /**
     * loading boolean
     */
    public loading: boolean = true;

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public modal: modal,
        public toast: toast,
        public currency: currency,
    ) {

    }

    /**
     * backend get request for the contents of the config table, loads the currencies
     */
    public ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('configuration/settings').subscribe(data => {

                this.settings = data;

                // switch developer mode
                switch (this.settings.advanced.developerMode){
                    case true:
                        this.settings.advanced.developerMode = '1';
                        break;
                    case false:
                        this.settings.advanced.developerMode = '0';
                        break;
                }

                // switch developer mode
                switch (this.settings.advanced.international_email_addresses){
                    case true:
                        this.settings.advanced.developerMode = '1';
                        break;
                    case false:
                        this.settings.advanced.developerMode = '0';
                        break;
                }

                this._loglevels = this.settings.logger.level.split(',');
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });
    }

    /**
     * save the settings
     */
    public save() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.postRequest('configuration/settings', {}, this.settings).subscribe(response => {
                if (response.status) {
                    this.toast.sendToast(this.language.getLabel('LBL_SUCCESS'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
            });
            modalRef.instance.self.destroy();
        });
    }

    public _loglevels = [];

    get loglevels() {
        return this._loglevels;
    }

    set loglevels(levels) {
        this._loglevels = levels;
        this.settings.logger.level = levels.join(',');
    }

    /**
     * getter to strip the MB from the max size
     */
    get loggerMaxSize(){
        return (this.settings.logger.file_maxsize ?? '').replace('MB', '');
    }

    /**
     *setter to add the MB to the max size
     *
     * @param maxSize
     */
    set loggerMaxSize(maxSize){
        this.settings.logger.file_maxsize = maxSize + 'MB';
    }
}
