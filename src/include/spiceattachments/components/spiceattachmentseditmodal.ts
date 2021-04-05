/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        this.backend.getRequest('spiceAttachments/categories/' + this.model.module).subscribe(res => {
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

        this.backend.postRequest('spiceAttachments/' + this.attachment.id, {}, body).subscribe(res => {
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
