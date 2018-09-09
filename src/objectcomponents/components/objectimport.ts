import {AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';

import {objectimport} from '../services/objectimport.service';

declare var _: any;

@Component({
    selector: 'object-import',
    templateUrl: './app/objectcomponents/templates/objectimport.html',
    providers: [model, objectimport],
    styles: [
        ':host >>> .slds-progress__marker global-button-icon svg {fill:#CA1B1F}',
        ':host >>> .slds-progress__marker:hover global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:active global-button-icon svg {fill:#FD595D}',
        ':host >>> .slds-progress__marker:focus global-button-icon svg {fill:#FD595D}',
    ]
})
export class ObjectImport implements AfterViewInit {
    @ViewChild('contentcontainer', {read: ViewContainerRef}) contentcontainer: ViewContainerRef;

    currentImportStep: number = 0;
    importSteps: Array<any> = ['select', 'map', 'fixed', 'check', 'result'];
    importStepsText: Array<any> =
        [
            'LBL_SELECT_UPLOAD_FILE',
            'LBL_MAP_FIELDS',
            'LBL_ADD_FIXED_FIELDS',
            'LBL_DUPLICATE_CHECK',
            'LBL_RESULTS'
        ];
    templatename: string;
    importAction: string = 'new';
    processing: boolean = false;
    modelFields: Array<any> = undefined;
    requiredModelFields: Array<any> = undefined;
    stepText: string = '';

    constructor(private objectimport: objectimport,
                private language: language,
                private metadata: metadata,
                private model: model,
                private navigation: navigation,
                private router: Router,
                private backend: backend,
                private toast: toast,
                private cdRef: ChangeDetectorRef,
                private activatedRoute: ActivatedRoute) {

        // get the bean details
        this.model.module = this.activatedRoute.params['value']['module'];

        if(!this.metadata.checkModuleAcl(this.model.module, 'import')){
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

    getModuleFields() {
        if (this.model.module !== '') {
            this.modelFields = [];
            let fields = this.metadata.getModuleFields(this.model.module);
            for (let field in fields) {
                if (fields.hasOwnProperty(field)) {
                    let thisField = fields[field];
                    // check if file can be imported
                    if (thisField.type !== 'link' && thisField.type !== 'relate' && thisField.source !== 'non-db' && thisField.name != 'id') {
                        if (thisField.vname)
                            thisField.displayname = this.language.getModuleLabel(this.model.module, thisField.vname) + ' (' + thisField.name + ')';
                        else
                            thisField.displayname = thisField.name;

                        this.modelFields.push(thisField);
                    }
                }
            }
        }

        this.requiredModelFields = this.modelFields.filter(field => field.name != 'id' && field.required);
    }

    ngAfterViewInit() {
        // set the navigation paradigm
        this.navigation.setActiveModule(this.model.module);

        // get saved imports
        this.backend.getRequest('/modules/SpiceImports/savedImports/' + this.model.module).subscribe(res => {
            this.objectimport.savedImports = res;
        });

    }

    ngAfterViewChecked() {
        this.objectimport.stepLongText = this.language.getLabel(this.importStepsText[this.currentImportStep], '', 'long');
        this.cdRef.detectChanges();
    }

    setImportAction(action) {
        this.importAction = action;
        let index;

        switch (action) {
            case 'new':
                index = this.importSteps.indexOf('update');
                this.importSteps[index] = 'check';
                this.importStepsText[index] = 'LBL_DUPLICATE_CHECK';
                break;
            case 'update':
                index = this.importSteps.indexOf('check');
                this.importSteps[index] = 'update';
                this.importStepsText[index] = 'LBL_UPDATE_EXISTING_RECORDS';
                break;
        }
    }

    getCurrentStep() {
        this.objectimport.stepLongText = this.language.getLabel(this.importStepsText[this.currentImportStep], '', 'long');
        return this.language.getLabel(this.importStepsText[this.currentImportStep]);

    }

    gotoModule() {
        this.router.navigate(['/module/' + this.model.module]);
    }

    getContainerStyle() {
        let rect = this.contentcontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'auto'
        }
    }


    getStepClass(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        if (thisIndex == this.currentImportStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.currentImportStep) {
            return 'slds-is-completed';
        }
    }

    getStepComplete(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        if (thisIndex < this.currentImportStep) {
            return true;
        }
        return false;
    }

    getProgressBarWidth() {
        return {
            width: (this.currentImportStep / (this.importSteps.length - 1) * 100) + '%'
        }
    }

    nextStep() {
        switch (this.currentImportStep) {
            case 0:
                if (this.objectimport.fileName === '') {
                    return this.toast.sendToast(this.language.getLabel('MSG_SELECT_VALID_FILE'), 'error');
                } else {
                    if (this.objectimport.importTemplateAction == 'choose' &&
                        Object.keys(this.objectimport.fileMapping).length <= 0 &&
                        this.objectimport.checkFields.length == 0 &&
                        this.objectimport.fixedFields.length == 0)

                        return this.toast.sendToast(this.language.getLabel('LBL_MAKE_SELECTION'), 'error');

                    if (this.objectimport.importTemplateAction == 'new' && !this.templateName)
                        return this.toast.sendToast(this.language.getLabel('MSG_INPUT_REQUIRED'), 'error');

                    this.currentImportStep++;
                }
                break;
            case 1:
                if (Object.keys(this.objectimport.fileMapping).length <= 0)
                    return this.toast.sendToast(this.language.getLabel('MSG_MAP_FIELDS'), 'error');

                if (this.objectimport.idFieldAction == 'have' && this.objectimport.idField == '')
                    return this.toast.sendToast(this.language.getLabel('LBL_MAKE_SELECTION'), 'error');

                this.currentImportStep++;
                break;
            case 2:
                for (let field of this.objectimport.fixedFields) {
                    if (this.model.data.hasOwnProperty(field.field)) {
                        if (this.model.data[field.field].length < 1)
                            return this.toast.sendToast(this.language.getLabel('MSG_INPUT_REQUIRED'), 'error');
                    } else {
                        return this.toast.sendToast(this.language.getLabel('MSG_INPUT_REQUIRED'), 'error');
                    }
                }

                if (!this.checkRequiredMapped() && this.objectimport.importAction == 'new')
                    return this.toast.sendToast(this.language.getLabel('MSG_MAP_FIELDS'), 'error');

                this.currentImportStep++;
                break;
            case 3:
                if (this.importAction == 'update' && this.objectimport.checkFields.length < 1)
                    return this.toast.sendToast(this.language.getLabel('LBL_MAKE_SELECTION'), 'error');

                this.import();
                break;
            case 4:
                this.gotoModule();
                this.currentImportStep = 0; //reset
                break;
            default:
                this.currentImportStep++;
                break;
        }
    }

    checkRequiredMapped() {
        let invertedFileMapping = _.invert(this.objectimport.fileMapping),
            foundFieldsCount = 0,
            fixedFields = {};

        for (let field of this.objectimport.fixedFields)
            fixedFields[field.field] = field.field;

        for (let modelField of this.requiredModelFields) {
            if (modelField.name != 'id') {
                if (invertedFileMapping[modelField.name])
                    foundFieldsCount++;
                if (fixedFields[modelField.name])
                    foundFieldsCount++;
            }
        }

        if (this.requiredModelFields.length == foundFieldsCount)
            return true;
        else
            return false;
    }

    prevStep() {
        if (this.currentImportStep > 0)
            this.currentImportStep--;
    }

    showNext() {

        if (this.currentImportStep < this.importSteps.length - 2)
            return true;

        return false;
    }

    showImport() {

        if (this.currentImportStep == this.importSteps.length - 2)
            return true;

        return false;
    }

    showExit() {
        if (this.currentImportStep == this.importSteps.length - 1)
            return true;

        return false;

    }

    import() {

        let preparedObjectImport = this.prepareObjectImport('import');

        this.objectimport.result = {};
        this.processing = true;

        this.backend.postRequest('/modules/SpiceImports/import', {
            objectimport: JSON.stringify(preparedObjectImport),
        }).subscribe(res => {

            switch (res.status) {
                case 'imported':
                    this.objectimport.result = res;
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
            this.currentImportStep++;
        });
    }

    prepareObjectImport(type: string) {

        let objectImport = _.omit(this.objectimport, 'fileData', 'savedImports', 'result', 'importTemplateAction', 'stepLongText');
        objectImport.fixedFieldsValues = this.model.data;
        objectImport.module = this.model.module;

        if (this.objectimport.idField != '')
            objectImport.fileMapping[this.objectimport.idField] = 'id';

        if (objectImport.idFieldAction == 'have')
            objectImport.checkFields = [{'mappedField': this.objectimport.idField, 'moduleField': 'id'}];

        return objectImport;
    }
}