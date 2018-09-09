import {Injectable} from '@angular/core';

@Injectable()

export class objectimport {
    fileName: string = '';
    fileId: string = '';
    fileHeader: Array<any> = [];
    fileData: Array<any> = [];
    fileMapping: any = {};
    fileRows: string = '';
    fixedFields: Array<any> = [];
    importAction: string = 'new';
    checkFields: Array<any> = [];
    savedImports: Array<any> = [];
    importDuplicateAction: string = 'ignore';
    result: any = {};
    fileTooBig: boolean = false;
    importTemplateAction: string = 'none';
    idfield: string = '';
    idFieldAction: string = 'auto';
    templateName: string = undefined;
    enclosure: string = 'none';
    separator: string = 'semicolon';
    stepLongText: string = '';

    constructor() {
    }

    set idField(idField){
        if(this.fileMapping[idField])
            delete this.fileMapping[idField];
        this.idfield = idField;
    }

    get idField(){
        return this.idfield;
    }

    resetSettings() {
        this.fileMapping = {};
        this.fixedFields = [];
        this.checkFields = [];
        this.idField = '';
        this.result = {};
    }

    addFixed() {
        this.fixedFields.push({
            field: undefined
        });
    }

    getFixed(row) {
        let rowIndex = this.fixedFields.indexOf(row);
        if (rowIndex > -1)
            return this.fixedFields[rowIndex].field;
        else
            return '';
    }

    setFixedField(index, value) {
        this.fixedFields[index].field = value;
    }

    removeFixed(index) {
        this.fixedFields.splice(index, 1);
    }

    addCheck() {
        this.checkFields.push({
            field: undefined
        })
    }

    getCheckField(index) {
        if (this.checkFields[index] && this.checkFields[index].field)
            return this.checkFields[index].field;
        else
            return '';
    }

    setCheckField(index, value) {
        this.checkFields[index].field = value;
    }

    removeCheck(index) {
        this.checkFields.splice(index, 1);
    }

    getMapping(importField) {
        if (Object.keys(this.fileMapping).length > 0 && this.fileMapping[importField])
            return this.fileMapping[importField];
        else
            return '';
    }

    setMapping(importField, modelField) {
        if (modelField != '') {
            this.fileMapping[importField] = modelField;
        } else {
            delete(this.fileMapping[importField]);
        }
    }

    setSavedImport(id) {

        this.resetSettings();
        this.savedImports.some(item => {
            if (item.id === id) {
                for (let key in item.mappings) {
                    if (this.fileHeader.indexOf(key) != -1)
                        this.fileMapping[key] = item.mappings[key];
                }
                this.fixedFields = item.fixed;
                this.checkFields = item.checks;
                return true;
            }
        })
    }

}