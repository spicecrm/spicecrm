/*
SpiceUI 2021.01.001

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

    constructor(private backend: backend, private modelutilities: modelutilities) {
    }


    /**
     * Load entries from selected dictionary
     * @param fielddefs Array
     */
    public loadEntries(fielddefs = []) {
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
                });
            }
        });
    }

    /**
     * @param record
     */
    private mapData(record) {
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
    private remapData(record) {
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
                this.backend.postRequest('configurator/' + this.dictionary + '/' + id, {}, this.remapData(entry.data)).subscribe(status => {
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
                this.backend.deleteRequest('configurator/' + this.dictionary + '/' + id).subscribe(status => {
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
