/**
 * @module AdminComponentsModule
 */
import { EventEmitter, Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import {backend} from '../../services/backend.service';
import {modelutilities} from '../../services/modelutilities.service';
import {configurationService} from "../../services/configuration.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {administration} from "./administration.service";

@Injectable()
/**
 * This service handles data retrieved from metadata dictionaries (simple config tables)
 * Data is retrieved, fields are mapped dynamically for display in workbench.
 * Please check sysuiadmincomponents component config for adjustments needed in form layout.
 */
export class administrationconfigurator {

    public set loading( v: boolean ) {
        this._loading = v;
        this.closable$.next( !( this.saving || this.loading || this.editing ));
    };
    public get loading(): boolean { return this._loading; }
    public _loading: boolean = false;

    public set saving( v: boolean ) {
        this._saving = v;
        this.closable$.next( !( this.saving || this.loading || this.editing ));
    };
    public get saving(): boolean { return this._saving; }
    public _saving = false;

    public set editing( v: boolean ) {
        this._editing = v;
        this.closable$.next( !( this.saving || this.loading || this.editing ));
    };
    public get editing(): boolean { return this._editing; }
    public _editing = false;

    public closable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( !( this.saving || this.loading || this.editing ) );
    public dataChanged$ = new EventEmitter();

    public dictionary: string = '';
    public entries: any = [];
    public sorting: any = {
        field: '',
        direction: ''
    };
    public fielddefobj: any = {};

    public reloadTaskItems: string[] = [];

    public foreignkeys: any = {};

    constructor(public backend: backend,
                public modelutilities: modelutilities,
                private configurationService: configurationService,
                private toast: toast,
                public modal: modal,
                public administration: administration
    ) {
    }


    /**
     * Load entries from selected dictionary
     * @param fielddefs Array
     */
    public loadEntries(fielddefs = []) {
        this.loading = true;
        this.backend.getRequest('configuration/configurator/byid/' + this.administration.opened_itemid).subscribe({
            next: (data) => {

                // set the foreign keys
                this.foreignkeys = data.foreignkeys;

                // traverse the fielddefs
                this.fielddefobj = {};
                for (let fielddef of fielddefs) {
                    this.fielddefobj[fielddef.name] = fielddef.type ? fielddef.type : '';
                }

                this.entries = data.entries.map(entry=> {
                    return {
                        id: entry.id,
                        mode: '',
                        data: this.mapData(entry)
                    }
                })


                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    /**
     * @param record
     */
    public mapData(record) {
        for (let field in this.fielddefobj) {
            switch (this.fielddefobj[field]) {
                case 'bool':
                case 'boolean':
                    record[field] = record[field] == '1' ? true : false;
            }
        }
        return record;
    }

    /**
     * @param record
     */
    public remapData(record) {
        let newRecord = {};
        for (let field in this.fielddefobj) {
            switch (this.fielddefobj[field]) {
                case 'bool':
                case 'boolean':
                    newRecord[field] = record[field]  == true ? '1' : '0';
                    break;
                default:
                    newRecord[field] = record[field];
                    break;
            }
        }
        return newRecord;
    }

    /**
     */
    public addEntry() {
        let newId = this.modelutilities.generateGuid();
        this.entries.unshift({
            id: newId,
            mode: 'new',
            data: {
                id: newId
            }
        });
        this.editing = this.isEditModeGeneral();
    }

    /**
     * reload the frontend cache for the related task item
     * @private
     */
    private reloadCache() {
        this.reloadTaskItems.forEach(key => {
            this.configurationService.reloadTaskData(key);
        })
    }

    /**
     * checks if a record can be saved
     *
     * @param id
     */
    public canSave(id){
        let entry = this.entries.find(e => e.id == id);
        return JSON.stringify(entry.data) != JSON.stringify(entry.backup);
    }

    /**
     * @param id
     */
    public saveEntry(id) {
        let retSubject = new Subject();
        let entry = this.entries.find(e => e.id == id);
        let saveModal = this.modal.await('LBL_SAVING');
        delete (entry.backup);
        this.backend.postRequest('configuration/configurator/' + this.dictionary + '/' + id, {}, {config: this.remapData(entry.data)}).subscribe({
            next: (status) => {
                entry.mode = '';
                this.reloadCache();
                saveModal.emit(true);
                retSubject.next(true);
                this.editing = this.isEditModeGeneral();
                this.saving = false;
                this.dataChanged$.emit();
            }, error: (e) => {
                this.toast.sendToast('MSG_ERROR_SAVING_RECORD', 'error')
                saveModal.emit(true);
                retSubject.error(e);
                this.saving = false;
            }
        });

        return retSubject.asObservable();
    }

    /**
     * @param id
     */
    public deleteEntry(id) {
        this.entries.some((entry, index) => {
            if (entry.id === id) {
                delete(entry.backup);
                this.backend.deleteRequest('configuration/configurator/' + this.dictionary + '/' + id).subscribe(status => {
                    this.entries.splice(index, 1);
                    this.reloadCache();
                    this.dataChanged$.emit();
                });
                return true;
            }
        });
    }

    /**
     * @param id
     */
    public setEditMode(id) {
        this.entries.some(entry => {
            if (entry.id === id) {
                entry.mode = 'edit';
                entry.backup = JSON.parse(JSON.stringify(entry.data));
                this.editing = true;
                return true;
            }
        });
    }

    /**
     * @param id
     */
    public cancelEditMode(id) {
        this.entries.some((entry, index) => {
            if (entry.id === id) {
                if (entry.mode === 'new') {
                    this.entries.splice(index, 1);
                } else {
                    entry.data = JSON.parse(JSON.stringify(entry.backup));
                    delete(entry.backup);
                    entry.mode = '';
                }
                this.editing = this.isEditModeGeneral();
                return true;
            }
        });
    }

    /**
     * @param id
     */
    public isEditMode(id) {
        let editMode = false;
        this.entries.some(entry => {
            if (entry.id === id) {
                editMode = entry.mode === 'edit' || entry.mode === 'new';
                return true;
            }
        });
        return editMode;
    }

    /**
     * @param id
     */
    public copy(id) {
        this.entries.some(
            entry => {
                if (entry.id === id) {
                    let new_entry: any = {};
                    new_entry.data = JSON.parse(JSON.stringify(entry.data)); //  {...entry.data};
                    new_entry.mode = 'new';
                    new_entry.id = this.modelutilities.generateGuid();
                    new_entry.data.id = new_entry.id;
                    this.entries.unshift(new_entry);
                    this.editing = true;
                    return true;
                }
            }
        );
        // console.log(this.entries);
    }

    /**
     * @param field
     */
    public sort(field) {
        if (this.sorting.field === field) {
            this.sorting.direction = this.sorting.direction == 'asc' ? 'desc' : 'asc';
        } else {
            this.sorting.field = field;
            this.sorting.direction = 'asc';
        }

        this.entries.sort((a, b) => {
            if (a.data[this.sorting.field] == b.data[this.sorting.field]) {
                return 0;
            }

            if (this.sorting.direction == 'asc') {
                return a.data[this.sorting.field] < b.data[this.sorting.field] ? -1 : 1;
            } else {
                return a.data[this.sorting.field] < b.data[this.sorting.field] ? 1 : -1;
            }
        });
    }

    public isEditModeGeneral(): boolean
    {
        return this.entries.some( entry => entry.mode === 'edit' || entry.mode === 'new' );
    }
}
