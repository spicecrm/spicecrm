/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private modal: modal,
        private toast: toast
    ) {
        this.backend.getRequest('ftsmanager/core/modules').subscribe(modules => this.modules = modules);
        this.backend.getRequest('ftsmanager/core/analyzers').subscribe(analyzers => this.analyzers = analyzers.sort((a, b) => a.value > b.value ? 1 : -1));
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
        this.backend.getRequest('ftsmanager/' + this.module + '/fields').subscribe(fields => {
            this.moduleFtsFields = fields;
        });
    }

    public getModuleSettings() {
        this.moduleFtsSettings = [];
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

    public deleteModule(module) {
        this.backend.deleteRequest(`ftsmanager/${this.module}`).subscribe(done => {
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
            case 'bulk':
                url = `ftsmanager/${this.module}/index`;
                label = 'LBL_INDEX';
                break;
            case 'init':
                url = `ftsmanager/core/initialize`;
                label = 'LBL_INITIALIZE';
                break;
            case 'reset':
                url = `ftsmanager/${this.module}/index/reset`;
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
                                let headerText = result.type && result.type.length > 0 ? result.type : this.language.getLabel('LBL_INFO');
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
                            let headerText = result.type && result.type.length > 0 ? result.type : this.language.getLabel('LBL_INFO');
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
