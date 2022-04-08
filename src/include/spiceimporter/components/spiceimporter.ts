/**
 * @module SpiceImporterModule
 */
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';

import {SpiceImporterService} from '../services/spiceimporter.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    templateUrl: '../templates/spiceimporter.html',
    providers: [model, SpiceImporterService]
})
export class SpiceImporter implements OnInit {
    @ViewChild('contentcontainer', {read: ViewContainerRef, static: true}) public contentcontainer: ViewContainerRef;

    public importSteps: any[] = ['select', 'map', 'fixed', 'check', 'result'];
    public templatename: string;
    public importAction: string = 'new';
    public processing: boolean = false;
    public modelFields: any[] = undefined;
    public requiredModelFields: any[] = undefined;

    constructor(public spiceImporter: SpiceImporterService,
                public language: language,
                public metadata: metadata,
                public model: model,
                public navigationtab: navigationtab,
                public router: Router,
                public backend: backend,
                public toast: toast) {

        // get the bean details
        this.model.module = this.navigationtab.activeRoute.params.module;
        if (!this.metadata.checkModuleAcl(this.model.module, 'import')) {
            this.toast.sendToast(this.language.getLabel('MSG_NOT_AUTHORIZED_TO_IMPORT') + ' ' + this.language.getModuleName(this.model.module), 'error');
            this.router.navigate(['/module/' + this.model.module]);
        }

        this.getModuleFields();
    }

    get templateName() {
        return this.templatename;
    }

    set templateName(name) {
        this.templatename = name;
    }

    get currentImportStep() {
        return this.spiceImporter.currentImportStep;
    }

    public ngOnInit() {
        // set the navigation paradigm
        this.navigationtab.setTabInfo({
            displayname: this.language.getLabel('LBL_IMPORT'),
            displaymodule: this.model.module
        });

        // get saved imports
        this.backend.getRequest('module/SpiceImports/savedimports/' + this.model.module).subscribe(res => {
            this.spiceImporter.savedImports = res;
        });

    }

    public getModuleFields() {
        if (this.model.module !== '') {
            this.modelFields = [];
            let fields = this.metadata.getModuleFields(this.model.module);
            for (let field in fields) {
                if (fields.hasOwnProperty(field)) {
                    let thisField = fields[field];
                    // check if file can be imported
                    if (thisField.type !== 'link' && thisField.type !== 'relate' && (thisField.name == 'email1' || thisField.source !== 'non-db') && thisField.name != 'id') {
                        if (thisField.vname) {
                            thisField.displayname = this.language.getLabel(this.model.module, thisField.vname) + ' (' + thisField.name + ')';
                        } else {
                            thisField.displayname = thisField.name;
                        }

                        this.modelFields.push(thisField);
                    }
                }
            }
        }

        this.requiredModelFields = this.modelFields.filter(field => field.name != 'id' && field.required);
    }

    public setImportAction(action) {
        this.importAction = action;
        let index;

        switch (action) {
            case 'new':
                index = this.importSteps.indexOf('update');
                this.importSteps[index] = 'check';
                this.spiceImporter.importStepsText[index] = 'LBL_DUPLICATE_CHECK';
                break;
            case 'update':
                index = this.importSteps.indexOf('check');
                this.importSteps[index] = 'update';
                this.spiceImporter.importStepsText[index] = 'LBL_UPDATE_EXISTING_RECORDS';
                break;
        }
    }

    public getCurrentStep() {
        return this.language.getLabel(this.spiceImporter.importStepsText[this.spiceImporter.currentImportStep]);

    }

    public gotoModule() {
        this.router.navigate(['/module/' + this.model.module]);
    }

    public getContainerStyle() {
        let rect = this.contentcontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'auto'
        };
    }


    public getStepClass(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        if (thisIndex == this.spiceImporter.currentImportStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.spiceImporter.currentImportStep) {
            return 'slds-is-completed';
        }
    }

    public getStepComplete(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        return thisIndex < this.spiceImporter.currentImportStep;

    }

    public getProgressBarWidth() {
        return {
            width: (this.spiceImporter.currentImportStep / (this.importSteps.length - 1) * 100) + '%'
        };
    }

    public nextStep() {
        switch (this.spiceImporter.currentImportStep) {
            case 0:
                if (this.spiceImporter.fileName === '') {
                    return this.toast.sendToast(this.language.getLabel('MSG_SELECT_VALID_FILE'), 'error');
                } else {
                    if (this.spiceImporter.importTemplateAction == 'choose' &&
                        Object.keys(this.spiceImporter.fileMapping).length <= 0 &&
                        this.spiceImporter.checkFields.length == 0 &&
                        this.spiceImporter.fixedFields.length == 0) {
                        return this.toast.sendToast(this.language.getLabel('LBL_MAKE_SELECTION'), 'error');
                    }

                    if (this.spiceImporter.importTemplateAction == 'new' && !this.templateName) {
                        return this.toast.sendToast(this.language.getLabel('MSG_INPUT_REQUIRED'), 'error');
                    }

                    this.spiceImporter.currentImportStep++;
                }
                break;
            case 1:
                if (Object.keys(this.spiceImporter.fileMapping).length <= 0) {
                    return this.toast.sendToast(this.language.getLabel('MSG_MAP_FIELDS'), 'error');
                }

                if (this.spiceImporter.idFieldAction == 'have' && this.spiceImporter.idField == '') {
                    return this.toast.sendToast(this.language.getLabel('LBL_MAKE_SELECTION'), 'error');
                }

                this.spiceImporter.currentImportStep++;
                break;
            case 2:
                for (let field of this.spiceImporter.fixedFields) {
                    if (this.model.data.hasOwnProperty(field.field)) {
                        if (this.model.data[field.field].length < 1) {
                            return this.toast.sendToast(this.language.getLabel('MSG_INPUT_REQUIRED'), 'error');
                        }
                    } else {
                        return this.toast.sendToast(this.language.getLabel('MSG_INPUT_REQUIRED'), 'error');
                    }
                }

                if (!this.checkRequiredMapped() && this.spiceImporter.importAction == 'new') {
                    return this.toast.sendToast(this.language.getLabel('MSG_MAP_FIELDS'), 'error');
                }

                this.spiceImporter.currentImportStep++;
                break;
            case 3:
                if (this.importAction == 'update' && this.spiceImporter.checkFields.length < 1) {
                    return this.toast.sendToast(this.language.getLabel('LBL_MAKE_SELECTION'), 'error');
                }

                this.import();
                break;
            case 4:
                this.gotoModule();
                this.spiceImporter.currentImportStep = 0; // reset
                break;
            default:
                this.spiceImporter.currentImportStep++;
                break;
        }
    }

    public checkRequiredMapped() {
        let invertedFileMapping = _.invert(this.spiceImporter.fileMapping),
            foundFieldsCount = 0,
            fixedFields = {};

        for (let field of this.spiceImporter.fixedFields) {
            fixedFields[field.field] = field.field;
        }

        for (let modelField of this.requiredModelFields) {
            if (modelField.name != 'id') {
                if (invertedFileMapping[modelField.name]) {
                    foundFieldsCount++;
                }
                if (fixedFields[modelField.name]) {
                    foundFieldsCount++;
                }
            }
        }

        return this.requiredModelFields.length == foundFieldsCount;
    }

    public prevStep() {
        if (this.spiceImporter.currentImportStep > 0) {
            this.spiceImporter.currentImportStep--;
        }
    }

    public showNext() {

        return this.spiceImporter.currentImportStep < this.importSteps.length - 2;


    }

    public showImport() {

        return this.spiceImporter.currentImportStep == this.importSteps.length - 2;


    }

    public showExit() {
        return this.spiceImporter.currentImportStep == this.importSteps.length - 1;


    }

    public import() {

        let preparedObjectImport = this.prepareObjectImport();

        this.spiceImporter.result = {};
        this.processing = true;

        this.backend.postRequest('module/SpiceImports/import', {
            objectimport: preparedObjectImport,
        }).subscribe(res => {

            switch (res.status) {
                case 'imported':
                    this.spiceImporter.result = res;
                    break;
                case 'scheduled':
                    this.gotoModule();
                    this.toast.sendToast(res.msg, 'success');
                    break;
                case 'error':
                    this.toast.sendToast(res.msg, 'error', '', false);
                    break;
            }

            this.processing = false;
            this.spiceImporter.currentImportStep++;
        });
    }

    public prepareObjectImport() {

        let objectImport = _.pick(this.spiceImporter,
            'fileName',
            'fileId',
            'fileHeader',
            'fileMapping',
            'templateName',
            'fileTooBig',
            'enclosure',
            'separator',
            'checkFields',
            'importAction',
            'idFieldAction',
            'idField',
            'fixedFields',
            'importDuplicateAction',
        );
        objectImport.fixedFieldsValues = this.model.data;
        objectImport.module = this.model.module;

        if (this.spiceImporter.idField != '') {
            objectImport.fileMapping[this.spiceImporter.idField] = 'id';
        }

        if (objectImport.idFieldAction == 'have') {
            objectImport.checkFields = [{mappedField: this.spiceImporter.idField, moduleField: 'id'}];
        }

        return objectImport;
    }
}
