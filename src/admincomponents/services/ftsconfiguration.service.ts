/**
 * @module AdminComponentsModule
 */
import {Injectable} from '@angular/core';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";


import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {modal} from "../../services/modal.service";

@Injectable()
export class ftsconfiguration {
    public module: string = '';
    public moduleFtsFields: any = [];
    public moduleFtsSettings: any = {};
    public indexing: boolean = false;
    public fieldsDropList: CdkDropList;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private modal: modal,
        private toast: toast
    ) {
    }

    public setModule(module) {
        this.module = module;
        this.getModuleFtsFields();
        this.getModuleSettings();
    }

    public getModuleFtsFields() {
        this.moduleFtsFields = [];
        this.backend.getRequest('ftsmanager/' + this.module + '/fields').subscribe(fields => {
            this.moduleFtsFields = fields;
        });
    }

    public getModuleSettings() {
        this.moduleFtsFields = [];
        this.backend.getRequest('ftsmanager/' + this.module + '/settings').subscribe(settings => {
            this.moduleFtsSettings = settings;
        });
    }

    public getFieldDetails(id) {
        let fieldDetails: any = {};

        this.moduleFtsFields.some(field => {
            if (field.id === id) {
                fieldDetails = field;
                return true;
            }
        });

        return fieldDetails;
    }

    public save() {
        let postData = {
            fields: this.moduleFtsFields,
            settings: this.moduleFtsSettings
        };
        this.backend.postRequest('ftsmanager/' + this.module, {}, postData).subscribe(response => {
            if (response) {
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
            }
        });
    }

    public searchPath(path) {
        let pathFound = false;
        this.moduleFtsFields.some(field => {
            if (field.path === path) {
                pathFound = true;
                return true;
            }
        });
        return pathFound;
    }

    public executeAction(action) {
        let url = '';
        let label = '';
        switch (action) {
            case 'index':
                url = `ftsmanager/${this.module}/index`;
                label = 'LBL_INDEX';
                break;
            case 'bulk':
                url = `ftsmanager/${this.module}/index`;
                label = 'LBL_INDEX_BULK';
                break;
            case 'init':
                url = `ftsmanager/core/initialize`;
                label = 'LBL_INITIALIZE';
                break;
            case 'reset':
                url = `ftsmanager/${this.module}/resetindex`;
                label = 'LBL_RESET';
                break;
            case 'put':
                url = `ftsmanager/${this.module}/map`;
                label = 'LBL_PUT_MAPPING';
                break;
        }

        let params = action == 'bulk' ? {bulk: true} : {};
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = this.language.getLabel('LBL_EXECUTING') +' '+ this.language.getLabel(label);
            if (action == 'put') {
                this.backend.deleteRequest('ftsmanager/' + this.module).subscribe(result => {
                    this.backend.postRequest(url).subscribe(
                        result => {
                            loadingModalRef.instance.self.destroy();
                        },
                        error => loadingModalRef.instance.self.destroy()
                    );
                }, error => loadingModalRef.instance.self.destroy());
            } else {
                this.backend.postRequest(url, params).subscribe(
                    result => loadingModalRef.instance.self.destroy(),
                    error => loadingModalRef.instance.self.destroy()
                );
            }
        });
    }
}
