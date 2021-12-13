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
    templateUrl: '../templates/spiceimporterselect.html'
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
    public isLoading: boolean = false;
    /**
     * holds enclosure options
     * @private
     */
    public enclosureOptions = [
        {label: "'", value: 'single'},
        {label: ' ', value: 'none'},
        {label: '"', value: 'double'},
    ];

    constructor(
        public spiceImport: SpiceImporterService,
        public toast: toast,
        public backend: backend,
        public language: language
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
    public resetOptions() {
        this.spiceImport.importDuplicateAction = 'ignore';
        this.spiceImport.importTemplateAction = 'none';
        this.spiceImport.idFieldAction = 'auto';
    }

    /**
     * set save import data
     * @param event
     * @private
     */
    public setSavedImport(event) {
        this.spiceImport.setSavedImport(event.srcElement.value);
    }

    /**
     * clear file data
     * @private
     */
    public clearFile() {
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
    public loadFilePreview(file: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string, remove: () => void }) {

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
        this.backend.getRequest('module/SpiceImports/filepreview', params).subscribe(res => {

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
