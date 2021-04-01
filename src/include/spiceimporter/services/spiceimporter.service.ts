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
 * @module ObjectComponents
 */
import {Injectable} from '@angular/core';
import {language} from "../../../services/language.service";


/* @ignore */
declare var _: any;

@Injectable()

export class SpiceImporterService {
    // For backend START //
    public fileMapping: any = {};
    public fileId: string = '';
    public fileName: string = '';
    public fileHeader: any[] = [];
    public checkFields: any[] = [];
    public fixedFields: any[] = [];
    public idfield: string = '';
    public templateName: string;
    public importDuplicateAction: string = 'ignore';
    public importAction: string = 'new';
    public importTemplateAction: string = 'none';
    public idFieldAction: string = 'auto';
    public enclosure: string = 'none';
    public separator: string = 'semicolon';
    public fileTooBig: boolean = false;
    // For backend END //
    public savedImports: any[] = [];
    public fileRows: string = '';
    public fileData;
    public currentImportStep: number = 0;
    public result: any = {};
    public importStepsText: any[] =
        [
            'LBL_SELECT_UPLOAD_FILE',
            'LBL_MAP_FIELDS',
            'LBL_ADD_FIXED_FIELDS',
            'LBL_DUPLICATE_CHECK',
            'LBL_RESULTS'
        ];

    constructor(private language: language) {}

    get stepLongText() {
        return this.language.getLabel(this.importStepsText[this.currentImportStep], '', 'long');
    }

    get idField() {
        return this.idfield;
    }

    set idField(idField) {
        if (this.fileMapping[idField]) {
            delete this.fileMapping[idField];
        }
        this.idfield = idField;
    }

    public resetSettings() {
        this.fileMapping = {};
        this.fixedFields = [];
        this.checkFields = [];
        this.idField = '';
        this.result = {};
    }

    public addFixed() {
        this.fixedFields.push({
            field: undefined
        });
    }

    public getFixed(row) {
        let rowIndex = this.fixedFields.indexOf(row);
        if (rowIndex > -1) {
            return this.fixedFields[rowIndex].field;
        } else {
            return '';
        }
    }

    public setFixedField(index, value) {
        this.fixedFields[index].field = value;
    }

    public removeFixed(index) {
        this.fixedFields.splice(index, 1);
    }

    public addCheck() {
        this.checkFields.push({
            field: undefined
        });
    }

    public getCheckField(index) {
        if (this.checkFields[index] && this.checkFields[index].field) {
            return this.checkFields[index].field;
        } else {
            return '';
        }
    }

    public setCheckField(index, value) {
        this.checkFields[index].field = value;
    }

    public removeCheck(index) {
        this.checkFields.splice(index, 1);
    }

    public getMapping(importField) {
        return this.fileMapping && this.fileMapping[importField] ? this.fileMapping[importField] : '';
    }

    public setMapping(importField, modelField) {
        if (modelField != '') {
            this.fileMapping[importField] = modelField;
        } else {
            delete (this.fileMapping[importField]);
        }
    }

    public setSavedImport(id) {

        this.resetSettings();
        this.savedImports.some(item => {
            if (item.id === id) {
                for (let key in item.mappings) {
                    if (item.mappings.hasOwnProperty(key) && this.fileHeader.indexOf(key) != -1) {
                        this.fileMapping[key] = item.mappings[key];
                    }
                }
                this.fixedFields = item.fixed;
                this.checkFields = item.checks;
                return true;
            }
        });
    }

}
