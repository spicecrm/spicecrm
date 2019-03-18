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
    module: string = '';
    moduleFtsFields: Array<any> = [];
    moduleFtsSettings: any = {};
    indexing: boolean = false;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private toast: toast
    ) {}

    setModule(module) {
        this.module = module;
        this.getModuleFtsFields();
        this.getModuleSettings();
    }

    getModuleFtsFields() {
        this.moduleFtsFields = [];
        this.backend.getRequest('ftsmanager/' + this.module + '/fields').subscribe(fields => {
            this.moduleFtsFields = fields;
        });
    }

    getModuleSettings() {
        this.moduleFtsFields = [];
        this.backend.getRequest('ftsmanager/' + this.module + '/settings').subscribe(settings => {
            this.moduleFtsSettings = settings;
        });
    }

    getFieldDetails(id) {
        let fieldDetails: any = {};

        this.moduleFtsFields.some(field => {
            if (field.id === id) {
                fieldDetails = field;
                return true;
            }
        });

        return fieldDetails;
    }

    save() {
        let postData = {
            fields: this.moduleFtsFields,
            settings: this.moduleFtsSettings
        };
        this.backend.postRequest('ftsmanager/' + this.module, {}, postData).subscribe(response => {
            if (response)
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            else
                this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
        });
    }

    searchPath(path) {
        let pathFound = false;
        this.moduleFtsFields.some(field => {
            if (field.path === path) {
                pathFound = true;
                return true;
            }
        });
        return pathFound;
    }

    putMapping() {
        this.indexing = true;
        this.backend.deleteRequest('ftsmanager/' + this.module).subscribe(result => {
            this.backend.postRequest('ftsmanager/' + this.module + '/map').subscribe(
                result => {
                    this.indexing = false;
                }
            );
        })
    }

    indexModule() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/' + this.module + '/index').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        )
    }

    initialize() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/core/initialize').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        )
    }


    resetModule() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/' + this.module + '/resetindex').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        )
    }

}
