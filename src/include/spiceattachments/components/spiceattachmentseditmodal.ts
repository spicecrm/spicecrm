/**
 * @module ModuleSpiceAttachments
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {model} from "../../../services/model.service";

/**
 * Display edit fields for spice attachment
 */
@Component({
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentseditmodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentsEditModal implements OnInit {
    /**
     * passed from the modal trigger
     */
    private attachment: any = {};

    /**
     * holds the local input data to update the original attachment after save
     */
    private inputData: {display_name?: string, category_ids?: string[], text?: string} = {};
    /**
     * holds the available categories
     * @private
     */
    protected categories: any[] = [];
    /**
     * holds references of self to destroy the modal
     * @private
     */
    private self: any = {};

    constructor(private configurationService: configurationService,
                private toast: toast,
                private language: language,
                private model: model,
                private backend: backend) {
    }

    /**
     * load categories from configuration service
     */
    public ngOnInit() {
        if (!!this.configurationService.getData('spiceattachments_categories')) {
            return this.categories = this.configurationService.getData('spiceattachments_categories');
        }
        this.backend.getRequest('common/spiceattachments/categories/' + this.model.module).subscribe(res => {
            if (!res || !Array.isArray(res)) return;
            this.categories = res;
            this.configurationService.setData('spiceattachments_categories', res);
        });
    }

    /**
     * close the modal
     * @private
     */
    private close() {
        this.self.destroy();
    }

    /**
     * save the attachment changes
     * @private
     */
    private save() {
        const body = {
            category_ids: this.inputData.category_ids.join(','),
            text: this.inputData.text,
            display_name: this.inputData.display_name
        };

        this.backend.postRequest('common/spiceattachments/' + this.attachment.id, {}, body).subscribe(res => {
           if (!!res && !!res.success) {

               if (!!this.inputData.category_ids && this.inputData.category_ids.join(',') != this.attachment.category_ids) {
                   this.attachment.category_ids = this.inputData.category_ids.join(',');
               }
               if (this.inputData.text != this.attachment.text) {
                   this.attachment.text = this.inputData.text;
               }
               if (this.inputData.display_name != this.attachment.display_name) {
                   this.attachment.display_name = this.inputData.display_name;
               }

               this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
           } else {
               this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
           }
           this.self.destroy();
        }, () => {
            this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
            this.self.destroy();
        });
    }
}
