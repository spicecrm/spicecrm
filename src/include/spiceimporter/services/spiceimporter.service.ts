/**
 * @module ObjectComponents
 */
import {Injectable} from '@angular/core';
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";


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
    public rejectExistingKey: string = '';

    // For backend END //
    public savedImports: any[] = [];
    public fileRows: string = '';
    public fileData;
    public currentImportStep: number = 0;
    public result: {list?: {status: 'imported' | 'Duplicate Entry' | 'Record Exists' | 'updated' | 'No Entries' ,recordId?: string, data: string[]}[]} = {};
    public importStepsText: any[] =
        [
            'LBL_SELECT_UPLOAD_FILE',
            'LBL_MAP_FIELDS',
            'LBL_ADD_FIXED_FIELDS',
            'LBL_DUPLICATE_CHECK',
            'LBL_RESULTS'
        ];

    public processByMethod = false;
    public availableClasses: {id: string, name: string}[] = [];

    /**
     * holds all nonDB fields
     */
    public nonDBFields: any[] = undefined;

    constructor(public language: language, private model: model, private backend: backend) {
    }

    public _selectedMethod: string;

    set selectedMethod(val: string) {
        this._selectedMethod = val;
        this.processByMethod = !!val;
    }

    get selectedMethod(): string {
        return this._selectedMethod;
    }

    get stepLongText() {
        return this.language.getLabel(this.importStepsText[this.currentImportStep], '', 'long');
    }

    get idField() {
        return this.idfield;
    }

    set idField(idField) {
        if (this.fileMapping[idField]) {
            //  delete this.fileMapping[idField];
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

    public loadModuleAvailableMethods() {
        this.backend.getRequest(`SpiceImports/${this.model.module}/methods`).subscribe((res: string[]) => {
            this.availableClasses = res.map(c =>  ({id: c, name: c}));
        });
    }
}
