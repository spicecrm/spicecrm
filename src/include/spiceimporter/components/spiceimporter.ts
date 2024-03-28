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

/**
 * view to import data from csv file
 */
@Component({
    selector: 'spice-importer',
    templateUrl: '../templates/spiceimporter.html',
    providers: [model, SpiceImporterService]
})
export class SpiceImporter implements OnInit {
    @ViewChild('contentcontainer', {read: ViewContainerRef, static: true}) public contentcontainer: ViewContainerRef;

    /**
     * import steps
     */
    public importSteps: any[] = ['select', 'map', 'fixed', 'check', 'result'];
    public templatename: string;
    public importAction: string = 'new';
    public processing: boolean = false;
    public modelFields: any[] = undefined;
    public requiredModelFields: any[] = undefined;
    public showNonDbFields = false;

    /**
     * holds references of self to destroy the component
     * */
    public self: any = {};

    constructor(public spiceImporter: SpiceImporterService,
                public language: language,
                public metadata: metadata,
                public model: model,
                public navigationtab: navigationtab,
                public router: Router,
                public backend: backend,
                public toast: toast) {

        /**
         * get the bean details
          */
        this.model.module = this.navigationtab.activeRoute.params.module;

        /**
         * initialize model to get acls and field settings
          */
        this.model.initialize();

        if (!this.metadata.checkModuleAcl(this.model.module, 'import')) {
            this.toast.sendToast(this.language.getLabel('MSG_NOT_AUTHORIZED_TO_IMPORT') + ' ' + this.language.getModuleName(this.model.module), 'error');
            this.router.navigate(['/module/' + this.model.module]);
        }

        this.getModuleFields();
    }

    /**
     * get the template name
     */
    get templateName() {
        return this.templatename;
    }

    /**
     * set the template name
     * @param name
     */
    set templateName(name) {
        this.templatename = name;
    }

    /**
     * get the current import step
     */
    get currentImportStep() {
        return this.spiceImporter.currentImportStep;
    }

    /**
     * set the navigation paradigm and get saved imports
     */
    public ngOnInit() {
        this.navigationtab.setTabInfo({
            displayname: this.language.getLabel('LBL_IMPORT'),
            displaymodule: this.model.module
        });
        this.spiceImporter.loadModuleAvailableMethods();

        this.backend.getRequest('module/SpiceImports/savedimports/' + this.model.module).subscribe(res => {
            this.spiceImporter.savedImports = res;
        });

    }

    /**
     * get module fields and check if file can be imported
     */
    public getModuleFields() {
        if (this.model.module !== '') {
            this.modelFields = [];
            this.spiceImporter.nonDBFields = [];
            let fields = this.metadata.getModuleFields(this.model.module);
            for (let field in fields) {
                if (fields.hasOwnProperty(field)) {
                    let thisField = fields[field];

                    if (thisField.type !== 'link' && thisField.type !== 'relate' && (thisField.source != 'non-db' || this.showNonDbFields) && thisField.name != 'id') {

                        thisField.displayname = thisField.name;

                        this.modelFields.push(thisField);
                    }

                    // push non-db fields into a separate array
                    if(thisField.source == 'non-db' || thisField.type == 'link' || thisField.type == 'relate'){
                        this.spiceImporter.nonDBFields.push(thisField);
                    }
                }
            }
        }
        // this.modelFields.sort((a, b) => a.name.localeCompare(b.name));
        this.requiredModelFields = this.modelFields.filter(field => field.name != 'id' && field.required);
    }

    /**
     * set the import action
     * @param action
     */
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

    /**
     * get the current step
     */
    public getCurrentStep() {
        return this.language.getLabel(this.spiceImporter.importStepsText[this.spiceImporter.currentImportStep]);

    }

    /**
     * go to the module
     */
    public gotoModule() {
        this.self.destroy();
        this.navigationtab.closeTab();
        this.router.navigate(['/module/' + this.model.module]);
    }

    /**
     * get the container style
     */
    public getContainerStyle() {
        let rect = this.contentcontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'auto'
        };
    }

    /**
     * get the step class
     * @param convertStep
     */
    public getStepClass(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        if (thisIndex == this.spiceImporter.currentImportStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.spiceImporter.currentImportStep) {
            return 'slds-is-completed';
        }
    }

    /**
     * get the step complete
     * @param convertStep
     */
    public getStepComplete(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        return thisIndex < this.spiceImporter.currentImportStep;

    }

    /**
     * define width
     */
    public getProgressBarWidth() {
        return {
            width: (this.spiceImporter.currentImportStep / (this.importSteps.length - 1) * 100) + '%'
        };
    }

    /**
     * handles the progressing steps checks model validity
     */
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

    /**
     * check if required items are mapped
     */
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

    /**
     * moves one step backwards
     */
    public prevStep() {
        if (this.spiceImporter.currentImportStep > 0) {
            this.spiceImporter.currentImportStep--;
        }
    }

    /**
     * determines if the next button is shown
     */
    public showNext() {

        return this.spiceImporter.currentImportStep < this.importSteps.length - 2;
    }

    /**
     * determines if items were logged
     */
    public showImport() {

        return this.spiceImporter.currentImportStep == this.importSteps.length - 2;
    }

    public showExit() {
        return this.spiceImporter.currentImportStep == this.importSteps.length - 1;
    }
    /**
     * determines if the import button is shown
     */
    public import() {

        if (!this.spiceImporter.processByMethod && this.importAction == 'update' && this.spiceImporter.checkFields.length < 1) {
            return this.toast.sendToast(this.language.getLabel('LBL_MAKE_SELECTION'), 'error');
        }

        let preparedObjectImport = this.prepareObjectImport();

        this.spiceImporter.result = {};
        this.processing = true;

        this.backend.postRequest('module/SpiceImports/import',  null,{
            objectimport: preparedObjectImport,
        }).subscribe(res => { 

            switch (res.status) {
                case 'imported':
                    this.spiceImporter.result = res;
                    this.toast.sendToast(this.language.getLabel('LBL_SUCCESS'), 'success');
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
            this.spiceImporter.currentImportStep = 4;
        });
    }

    /**
     * prepare the object import
     */
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
            'selectedMethod',
            'rejectExistingKey'
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
