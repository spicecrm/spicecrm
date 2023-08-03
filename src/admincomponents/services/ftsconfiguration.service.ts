/**
 * @module AdminComponentsModule
 */
import {Injectable, OnInit, EventEmitter} from '@angular/core';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";


import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {modal} from "../../services/modal.service";
import {Subject} from "rxjs";
import {configurationService} from "../../services/configuration.service";

@Injectable()
export class ftsconfiguration {
    public module: string = '';
    public module$: EventEmitter<string> = new EventEmitter<string>();
    public moduleFtsFields: any = [];
    public moduleFtsSettings: any = {};
    public indexing: boolean = false;
    public fieldsDropList: CdkDropList;

    public modules: any[] = [];
    public analyzers: any[] = [];

    constructor(
        public backend: backend,
        public metadata: metadata,
        public language: language,
        public modal: modal,
        public toast: toast,
        public configurationService: configurationService,
    ) {
        this.backend.getRequest('configuration/elastic/core/modules').subscribe(modules => this.modules = modules);
        this.backend.getRequest('configuration/elastic/core/analyzers').subscribe(analyzers => this.analyzers = analyzers.sort((a, b) => a.value > b.value ? 1 : -1));
    }

    /**
     * set the current module .. if the module is known retrieve the fields ... otherwise add it and set empty set empty
     *
     * @param module
     */
    public setModule(module) {
        this.module = module;
        if (this.modules.indexOf(module) >= 0) {
            this.getModuleFtsFields();
            this.getModuleSettings();
        } else if (this.module) {
            this.modules.push(module);
            this.moduleFtsFields = [];
            this.moduleFtsSettings = [];
        } else {
            this.moduleFtsFields = [];
            this.moduleFtsSettings = [];
        }
        this.module$.emit(module);
    }

    public getModuleFtsFields() {
        this.moduleFtsFields = [];
        this.backend.getRequest('configuration/elastic/' + this.module + '/fields').subscribe(fields => {
            this.moduleFtsFields = fields;
        });
    }

    public getModuleSettings() {
        this.moduleFtsSettings = [];
        this.backend.getRequest('configuration/elastic/' + this.module + '/settings').subscribe(settings => {
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

    public deleteModule(module) {
        this.backend.deleteRequest(`configuration/elastic/${this.module}`).subscribe(done => {
            this.modules.splice(this.modules.indexOf(module), 1);
            this.module = '';
        });
    }

    public save(notify = true) {
        let responseSubject = new Subject<any>();
        let postData = {
            fields: this.moduleFtsFields,
            settings: this.moduleFtsSettings
        };
        this.backend.postRequest('configuration/elastic/' + this.module, {}, postData).subscribe(response => {
            responseSubject.next(response);
            if (!notify) return;
            if (response) {
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                this.configurationService.reloadTaskData('moduledefs');
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
            case 'bulk':
                url = `configuration/elastic/${this.module}/index`;
                label = 'LBL_INDEX';
                break;
            case 'init':
                url = `configuration/elastic/core/initialize`;
                label = 'LBL_INITIALIZE';
                break;
            case 'reset':
                url = `configuration/elastic/${this.module}/index/reset`;
                label = 'LBL_RESET';
                break;
        }

        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = this.language.getLabel('LBL_EXECUTING') + ': ' + this.language.getLabel(label);
            if (action == 'reset') {
                this.save(false).subscribe(res => {
                    this.backend.postRequest(url, params).subscribe(
                        result => {
                            if (result && result.message && typeof result.message == 'string' && result.message.length > 0) {
                                let headerText = result.type && result.type.length > 0 ? result.type : this.language.getLabel('LBL_INFORMATION');
                                this.modal.info(result.message, headerText, result.status);
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
                            let headerText = result.type && result.type.length > 0 ? result.type : this.language.getLabel('LBL_INFORMATION');
                            this.modal.info(result.message, headerText, result.status);
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
