/**
 * @module AdminComponentsModule
 */
import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

import {backend} from '../../services/backend.service';
import {modelutilities} from '../../services/modelutilities.service';

@Injectable()
/**
 * This service handles data retrieved from metadata dictionaries (simple config tables)
 * Data is retrieved, fields are mapped dynamically for display in workbench.
 * Please check sysuiadmincomponents component config for adjustments needed in form layout.
 */
export class administrationconfigurator {

    public dictionary: string = '';
    public entries: any = [];
    public sorting: any = {
        field: '',
        direction: ''
    };
    public fielddefobj: any = {};

    constructor(public backend: backend, public modelutilities: modelutilities) {
    }


    /**
     * Load entries from selected dictionary
     * @param fielddefs Array
     */
    public loadEntries(fielddefs = []) {
        this.backend.getRequest('configuration/configurator/entries/' + this.dictionary).subscribe(data => {

            // traverse the fielddefs
            this.fielddefobj = {};
            for (let fielddef of fielddefs) {
                this.fielddefobj[fielddef.name] = fielddef.type ? fielddef.type : '';
            }

            for (let entry of data) {
                this.entries.push({
                    id: entry.id,
                    mode: '',
                    data: this.mapData(entry)
                });
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
    }

    /**
     * @param id
     */
    public saveEntry(id) {
        this.entries.some(entry => {
            if (entry.id === id) {
                delete(entry.backup);
                this.backend.postRequest('configuration/configurator/' + this.dictionary + '/' + id, {}, { config: this.remapData(entry.data)}).subscribe(status => {
                    entry.mode = '';
                });
                return true;
            }
        });
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
            this.sorting.direction = this.sorting.direction == 'asc' ? 'dsc' : 'asc';
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
}
