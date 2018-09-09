import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

import {backend} from '../../services/backend.service';
import {modelutilities} from '../../services/modelutilities.service';

@Injectable()
export class administrationconfigurator {

    dictionary: string = '';
    entries: Array<any> = [];
    sorting: any = {
        field: '',
        direction: ''
    };
    fielddefobj: any = {};

    constructor(private backend: backend, private modelutilities: modelutilities) {
    }

    loadEntries(fielddefs = []) {
        this.backend.getRequest('configurator/entries/' + this.dictionary).subscribe(data => {

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
                })
            }
        });
    }

    private mapData(record) {
        for (let field in this.fielddefobj) {
            switch (this.fielddefobj[field]) {
                case 'boolean':
                    record[field] = record[field] == '1' ? true : false;
            }
        }
        return record;
    }

    private remapData(record) {
        let newRecord = {};
        for (let field in this.fielddefobj) {
            switch (this.fielddefobj[field]) {
                case 'boolean':
                    newRecord[field] = record[field]  == 'true' ? '1' : '0';
                    break;
                default:
                    newRecord[field] = record[field];
                    break;
            }
        }
        return newRecord;
    }

    addEntry() {
        let newId = this.modelutilities.generateGuid();
        this.entries.unshift({
            id: newId,
            mode: 'new',
            data: {
                id: newId
            }
        });
    }

    saveEntry(id) {
        this.entries.some(entry => {
            if (entry.id === id) {
                delete(entry.backup);
                this.backend.postRequest('configurator/' + this.dictionary + '/' + id, {}, this.remapData(entry.data)).subscribe(status => {
                    entry.mode = '';
                });
                return true;
            }
        })
    }

    deleteEntry(id) {
        this.entries.some((entry, index) => {
            if (entry.id === id) {
                delete(entry.backup);
                this.backend.deleteRequest('configurator/' + this.dictionary + '/' + id).subscribe(status => {
                    this.entries.splice(index, 1);
                });
                return true;
            }
        })
    }

    setEditMode(id) {
        this.entries.some(entry => {
            if (entry.id === id) {
                entry.mode = 'edit';
                entry.backup = JSON.parse(JSON.stringify(entry.data));
                return true;
            }
        })
    }

    cancelEditMode(id) {
        this.entries.some((entry, index) => {
            if (entry.id === id) {
                if (entry.mode === 'new')
                    this.entries.splice(index, 1);
                else {
                    entry.data = JSON.parse(JSON.stringify(entry.backup));
                    delete(entry.backup);
                    entry.mode = '';
                }
                return true;
            }
        })
    }

    isEditMode(id) {
        let editMode = false;
        this.entries.some(entry => {
            if (entry.id === id) {
                editMode = entry.mode === 'edit' || entry.mode === 'new';
                return true;
            }
        })
        return editMode;
    }

    copy(id)
    {
        this.entries.some(
            entry => {
                if (entry.id === id) {
                    let new_entry: any = {};
                    new_entry.data = JSON.parse(JSON.stringify(entry.data)); //  {...entry.data};
                    new_entry.mode = 'new';
                    new_entry.id = this.modelutilities.generateGuid();
                    this.entries.unshift(new_entry);
                    return true;
                }
            }
        );
        //console.log(this.entries);
    }

    sort(field) {
        if (this.sorting.field === field) {
            this.sorting.direction = this.sorting.direction == 'asc' ? 'dsc' : 'asc';
        } else {
            this.sorting.field = field;
            this.sorting.direction = 'asc';
        }

        this.entries.sort((a, b) => {
            if (a.data[this.sorting.field] == b.data[this.sorting.field])
                return 0;

            if (this.sorting.direction == 'asc') {
                return a.data[this.sorting.field] < b.data[this.sorting.field] ? -1 : 1;
            } else {
                return a.data[this.sorting.field] < b.data[this.sorting.field] ? 1 : -1;
            }
        })
    }
}
