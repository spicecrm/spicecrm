/**
 * @module ModuleSpiceUrls
 */
import {Component, Input} from '@angular/core';
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {model} from "../../../services/model.service";

/**
 * Display edit fields for spice url
 */
@Component({
    selector: 'spice-urls-edit-modal',
    templateUrl: '../templates/spiceurlseditmodal.html'
})
export class SpiceUrlsEditModal {
    /**
     * passed from the modal trigger
     */
    @Input() public url: any = {};

    /**
     * holds the local input data to update the original url after save
     */
    public inputData: {url_name?: string, description?: string } = {};

    /**
     * holds references of self to destroy the modal
     */
    public self: any = {};

    constructor(public configurationService: configurationService,
                public toast: toast,
                public language: language,
                public model: model,
                public backend: backend) {
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * save the url changes
     */
    public save() {
        const body = {
            description: this.inputData.description,
            url_name: this.inputData.url_name ? this.inputData.url_name : ''
        };

        this.backend.postRequest('common/spiceurls/' + this.url.id, {}, body).subscribe({
            next: (res) => {
                if (!!res && !!res.success) {

                    if (this.inputData.description != this.url.description) {
                        this.url.description = this.inputData.description;
                    }
                    if (this.inputData.url_name != this.url.url_name) {
                        this.url.url_name = this.inputData.url_name;
                    }

                    this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
                this.self.destroy();
            }, error: () => {
                this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
                this.self.destroy();
            }
        });
    }
}
