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
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'administration-general-setting',
    templateUrl: './src/admincomponents/templates/administrationgeneralsettings.html',
})

export class AdministrationGeneralSettings implements OnInit {
    /**
     * array to catch the settings
     */
    private settings: any = [];

    /**
     * available options from backend
     */
    private options: any = [];

    /**
     * currencies
     */

    private currencies: any = [];
    /**
     * loading boolean
     */
    private loading: boolean = true;

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal,
        private toast: toast,
        private currency: currency,
        private configuration: configurationService
    ) {

    }

    /**
     * backend get request for the contents of the config table, loads the currencies
     */
    ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('admin/generalsettings').subscribe(data => {
                if (data.status) {
                    this.settings = data.settings;
                    this.options = data.defaults;
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
                this.currencies = this.currency.getCurrencies();
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });
    }

    /**
     * save the settings
     */
    private save() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.postRequest('admin/writesettings', {}, this.settings).subscribe( response => {
                if(response.status) {
                    this.toast.sendToast(this.language.getLabel('LBL_SUCCESS'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
            });
            modalRef.instance.self.destroy();
        });

    }
}
