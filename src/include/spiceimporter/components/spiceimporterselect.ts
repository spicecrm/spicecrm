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
 * @module SpiceImporterModule
 */
import {Component, EventEmitter, Output,} from '@angular/core';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {SpiceImporterService} from '../services/spiceimporter.service';
import {backend} from "../../../services/backend.service";

/**
 * Render a file selection and preview for the import
 */
@Component({
    selector: 'spice-importer-select',
    templateUrl: './src/include/spiceimporter/templates/spiceimporterselect.html'
})

export class SpiceImporterSelect {
    /**
     * holds the template name change emitter
     */
    @Output() public templateNameSet = new EventEmitter<any>();
    /**
     * holds the import action change emitter
     */
    @Output() public importActionSet = new EventEmitter<any>();
    /**
     * true if the file preview is loading
     * @private
     */
    private isLoading: boolean = false;
    /**
     * holds enclosure options
     * @private
     */
    private enclosureOptions = [
        {label: "'", value: 'single'},
        {label: ' ', value: 'none'},
        {label: '"', value: 'double'},
    ];

    constructor(
        private spiceImport: SpiceImporterService,
        private toast: toast,
        private backend: backend,
        private language: language
    ) {
    }

    /**
     * @return template name
     */
    get templateName() {
        return this.spiceImport.templateName;
    }

    /**
     * set template name
     * @param name
     */
    set templateName(name) {
        this.spiceImport.templateName = name;
        this.templateNameSet.emit(name);
    }

    /**
     * @return import action
     */
    get importAction() {
        return this.spiceImport.importAction;
    }

    /**
     * set import action
     * @param action
     */
    set importAction(action) {
        this.spiceImport.importAction = action;
        this.importActionSet.emit(action);
        this.spiceImport.idField = '';
        this.templateName = undefined;
        this.resetOptions();
        this.spiceImport.resetSettings();
    }

    /**
     * @return import template action
     */
    get importTemplateAction() {
        return this.spiceImport.importTemplateAction;
    }

    /**
     * set import template action
     * @param action
     */
    set importTemplateAction(action) {
        this.spiceImport.importTemplateAction = action;

        if (action != 'choose') {
            this.spiceImport.resetSettings();
        }
    }

    /**
     * reset select options
     * @private
     */
    private resetOptions() {
        this.spiceImport.importDuplicateAction = 'ignore';
        this.spiceImport.importTemplateAction = 'none';
        this.spiceImport.idFieldAction = 'auto';
    }

    /**
     * set save import data
     * @param event
     * @private
     */
    private setSavedImport(event) {
        this.spiceImport.setSavedImport(event.srcElement.value);
    }

    /**
     * clear file data
     * @private
     */
    private clearFile() {
        this.spiceImport.fileName = '';
        this.spiceImport.fileId = '';

        this.spiceImport.fileHeader = [];
        this.spiceImport.fileData = undefined;
        this.spiceImport.fileRows = '';
        this.spiceImport.fileTooBig = false;

        this.spiceImport.resetSettings();
    }

    /**
     * load file preview after upload
     * @param file
     * @private
     */
    private loadFilePreview(file: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string, remove: () => void }) {

        if (!file.file_mime_type.toLowerCase().includes('excel')) {
            this.toast.sendToast(this.language.getLabel('MSG_ONLY_CSV_ALLOWED'), 'error');
            return file.remove();
        }
        this.isLoading = true;

        this.spiceImport.fileName = file.file_name;
        this.spiceImport.fileId = file.file_md5;
        const params = {
            file_md5: file.file_md5,
            enclosure: this.spiceImport.enclosure,
            separator: this.spiceImport.separator
        };
        this.backend.getRequest('modules/SpiceImports/filePreview', params).subscribe(res => {

            this.isLoading = false;

            this.spiceImport.fileHeader = res.fileHeader;
            this.spiceImport.fileData = res.fileData;
            this.spiceImport.fileRows = res.fileRows;
            this.spiceImport.fileTooBig = res.fileTooBig;

            if (res.fileTooBig) {
                this.toast.sendToast(this.language.getLabel('MSG_FILE_ROWS_TOO_LARGE'), 'warning', '', false);
            }
        }, () => {
            this.isLoading = false;
            this.toast.sendToast(this.language.getLabel('ERR_CANT_READ_FILE_DATA'), 'error', '', false);
            file.remove();
        });
    }
}
