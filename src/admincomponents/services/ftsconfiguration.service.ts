/**
 * @module AdminComponentsModule
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {CanActivate}    from '@angular/router';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";


import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';

@Injectable()
export class ftsconfiguration {
    public module: string = '';
    public moduleFtsFields: any = [];
    public moduleFtsSettings: any = {};
    public indexing: boolean = false;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private toast: toast
    ) {}

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

    public putMapping() {
        this.indexing = true;
        this.backend.deleteRequest('ftsmanager/' + this.module).subscribe(result => {
            this.backend.postRequest('ftsmanager/' + this.module + '/map').subscribe(
                result => {
                    this.indexing = false;
                }
            );
        });
    }

    public indexModule() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/' + this.module + '/index').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        );
    }

    /**
     * CR1000257
     */
    public indexModuleBulk() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/' + this.module + '/index', { bulk: true },).subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        );
    }

    public initialize() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/core/initialize').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        );
    }


    public resetModule() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/' + this.module + '/resetindex').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        );
    }

}
