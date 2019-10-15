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
import {Subject} from "rxjs";

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

    public save(notify = true) {
        let responseSubject = new Subject<any>();
        let postData = {
            fields: this.moduleFtsFields,
            settings: this.moduleFtsSettings
        };
        this.backend.postRequest('ftsmanager/' + this.module, {}, postData).subscribe(response => {
            responseSubject.next(response);
            if (!notify) return;
            if (response) {
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
            }
        }, error => responseSubject.error(error));

        return responseSubject;
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

    public executeAction(action, params?) {
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
        }

        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = this.language.getLabel('LBL_EXECUTING') +' '+ this.language.getLabel(label);
            if (action == 'reset') {
            this.save(false).subscribe(res => {
                this.backend.postRequest(url, params).subscribe(
                    result => {
                        if (result && result.message && typeof result.message == 'string' && result.message.length > 0) {
                            this.modal.info(result.message, result.type, result.status);
                        } else if (result.status != 'error') {
                            this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                        }
                        loadingModalRef.instance.self.destroy();
                    },
                    error => loadingModalRef.instance.self.destroy()
                );
            }, error => loadingModalRef.instance.self.destroy());
            } else {
                this.backend.postRequest(url, params).subscribe(
                    result => {
                        if (result && result.message && typeof result.message == 'string' && result.message.length > 0) {
                            this.modal.info(result.message, result.type, result.status);
                        } else if (result.status != 'error') {
                            this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                        }
                        loadingModalRef.instance.self.destroy();
                    },
                    error => loadingModalRef.instance.self.destroy()
                );
            }
        });
    }
}
