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
    templateUrl: './src/include/spiceimporter/templates/spiceimporter.html',
    providers: [model, SpiceImporterService]
})
export class SpiceImporter implements OnInit {
    @ViewChild('contentcontainer', {read: ViewContainerRef, static: true}) private contentcontainer: ViewContainerRef;

    private importSteps: any[] = ['select', 'map', 'fixed', 'check', 'result'];
    private templatename: string;
    private importAction: string = 'new';
    private processing: boolean = false;
    private modelFields: any[] = undefined;
    private requiredModelFields: any[] = undefined;

    constructor(private spiceImporter: SpiceImporterService,
                private language: language,
                private metadata: metadata,
                private model: model,
                private navigationtab: navigationtab,
                private router: Router,
                private backend: backend,
                private toast: toast) {

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

    private getModuleFields() {
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

    private setImportAction(action) {
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

    private getCurrentStep() {
        return this.language.getLabel(this.spiceImporter.importStepsText[this.spiceImporter.currentImportStep]);

    }

    private gotoModule() {
        this.router.navigate(['/module/' + this.model.module]);
    }

    private getContainerStyle() {
        let rect = this.contentcontainer.element.nativeElement.getBoundingClientRect();
        return {
            'height': 'calc(100vh - ' + rect.top + 'px)',
            'overflow-y': 'auto'
        };
    }


    private getStepClass(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        if (thisIndex == this.spiceImporter.currentImportStep) {
            return 'slds-is-active';
        }
        if (thisIndex < this.spiceImporter.currentImportStep) {
            return 'slds-is-completed';
        }
    }

    private getStepComplete(convertStep) {
        let thisIndex = this.importSteps.indexOf(convertStep);
        return thisIndex < this.spiceImporter.currentImportStep;

    }

    private getProgressBarWidth() {
        return {
            width: (this.spiceImporter.currentImportStep / (this.importSteps.length - 1) * 100) + '%'
        };
    }

    private nextStep() {
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

    private checkRequiredMapped() {
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

    private prevStep() {
        if (this.spiceImporter.currentImportStep > 0) {
            this.spiceImporter.currentImportStep--;
        }
    }

    private showNext() {

        return this.spiceImporter.currentImportStep < this.importSteps.length - 2;


    }

    private showImport() {

        return this.spiceImporter.currentImportStep == this.importSteps.length - 2;


    }

    private showExit() {
        return this.spiceImporter.currentImportStep == this.importSteps.length - 1;


    }

    private import() {

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

    private prepareObjectImport() {

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
