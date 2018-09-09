import {Component, EventEmitter, Output, Renderer, ViewChild, ViewContainerRef,} from '@angular/core';
import {model} from '../../services/model.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {Subject, Observable} from 'rxjs';

import {objectimport} from '../services/objectimport.service';

@Component({
    selector: 'object-import-select',
    templateUrl: './src/objectcomponents/templates/objectimportselect.html',
    styles: [
        ':host {height: 100%;}',
        ':host >>> div.uploadbar {margin-left:-16px;margin-right:-16px;margin-top:16px;margin-bottom:-16px;width:calc(100% + 32px);height:8px;}',
        ':host >>> div.uploadprogress {width: 90%;height: 100%;background-color: red;}',
        `.slds-radio--button [type=radio]:checked+.slds-radio--button__label, 
        .slds-radio--button [type=radio]:checked+.slds-radio--faux, 
        .slds-radio--button [type=radio]:checked+.slds-radio_button__label, 
        .slds-radio--button [type=radio]:checked+.slds-radio_faux, 
        .slds-radio--button [type=radio]:checked~.slds-radio--faux, 
        .slds-radio--button [type=radio]:checked~.slds-radio_faux, 
        .slds-radio_button [type=radio]:checked+.slds-radio--button__label, 
        .slds-radio_button [type=radio]:checked+.slds-radio--faux, 
        .slds-radio_button [type=radio]:checked+.slds-radio_button__label, 
        .slds-radio_button [type=radio]:checked+.slds-radio_faux, 
        .slds-radio_button [type=radio]:checked~.slds-radio--faux, 
        .slds-radio_button [type=radio]:checked~.slds-radio_faux 
        { background-color: #CA1B1F}`
    ]
})


export class ObjectImportSelect {
    @ViewChild('fileupload', {read: ViewContainerRef}) fileupload: ViewContainerRef;

    showUploadModal: boolean = false;
    theProgress: number = 0;
    templatename: string;
    @Output() templateNameSet: EventEmitter<any> = new EventEmitter<any>();
    @Output() importActionSet: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private objectimport: objectimport,
        private toast: toast,
        private language: language,
        private session: session,
        private configurationService: configurationService,
        private model: model,
        private backend: backend,
        private renderer: Renderer
    ) {
    }

    get enclosure() {
        return this.objectimport.enclosure;
    }

    set enclosure(enclosure) {
        this.objectimport.enclosure = enclosure;
    }

    get separator() {
        return this.objectimport.separator;
    }

    set separator(separator) {
        this.objectimport.separator = separator;
    }

    get templateName() {
        return this.objectimport.templateName;
    }

    set templateName(name) {
        this.objectimport.templateName = name;
        this.templateNameSet.emit(name);
    }

    get importAction() {
        return this.objectimport.importAction;
    }

    set importAction(action) {
        this.objectimport.importAction = action;
        this.importActionSet.emit(action);
        this.objectimport.idField = '';
        this.templateName = undefined;
        this.resetOptions();
        this.objectimport.resetSettings();
    }

    get importTemplateAction() {
        return this.objectimport.importTemplateAction;
    }

    set importTemplateAction(action) {
        this.objectimport.importTemplateAction = action;

        if (action != 'choose')
            this.objectimport.resetSettings();
    }

    preventdefault(event: any) {
        if ((event.dataTransfer.items.length == 1 && event.dataTransfer.items[0].kind === 'file') || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    resetOptions() {
        this.objectimport.importDuplicateAction = 'ignore';
        this.objectimport.importTemplateAction = 'none';
        this.objectimport.idFieldAction = 'auto';
    }

    onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length == 1)
            this.doupload(files);
    }

    hasSavedImports() {
        return this.objectimport.savedImports.length > 0
    }

    getSavedImports() {
        return this.objectimport['savedImports'];
    }

    setSavedImport(event) {
        this.objectimport.setSavedImport(event.srcElement.value);
    }

    selectFile() {
        let event = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(this.fileupload.element.nativeElement, 'dispatchEvent', [event]);
    }

    uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    doupload(files) {
        if (files[0] && files[0].name) {
            this.showUploadModal = true;
            this.uploadAttachments(files).subscribe((retVal: any) => {


                if (retVal.progress) {
                    this.theProgress = retVal.progress.loaded / retVal.progress.total * 100
                } else if (retVal.files) {

                    this.objectimport.fileName = files[0].name;
                    this.objectimport.fileId = retVal.files[0].filemd5;
                    this.objectimport.fileHeader = retVal.files[0].fileheader;
                    this.objectimport.fileData = retVal.files[0].filedata;
                    this.objectimport.fileRows = retVal.files[0].filerows;
                    this.objectimport.fileTooBig = retVal.fileTooBig;

                    if (retVal.files[0].filedata.length === 0) {
                        this.clearFile();
                        this.toast.sendToast(this.language.getLabel('ERR_CANT_READ_FILE_DATA'), 'error', '', false);
                    }

                    if (retVal.fileTooBig && retVal.files[0].filedata.length > 0)
                        this.toast.sendToast(this.language.getLabel('MSG_FILE_ROWS_TOO_LARGE'), 'warning', '', false);

                } else if (retVal.status === 'error') {
                    this.toast.sendToast(this.language.getLabel('ERR_UPLOAD_FAILED'), 'error', retVal.data, false);
                }
            }, error => {
            }, () => this.closeUploadPopup());
        }
    }

    closeUploadPopup() {
        this.showUploadModal = false;
    }

    getBarStyle() {
        return {
            width: this.theProgress + '%'
        }
    }

    uploadAttachments(files): Observable<any> {
        if (files.length === 0)
            return;

        let retSub = new Subject<any>();

        var data = new FormData();
        data.append('file', files[0], files[0].name);

        var request = new XMLHttpRequest();
        let resp: any = {};
        request.onreadystatechange = function (scope: any = this) {
            if (request.readyState == 4) {
                try {
                    let retVal = JSON.parse(request.response);
                    retSub.next({files: retVal.files, fileTooBig: retVal.fileTooBig});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };

                    retSub.next(resp);
                    retSub.complete();
                }
            }
        };

        request.upload.addEventListener('progress', function (e: any) {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
        }, false);

        request.open('POST', this.configurationService.getBackendUrl() +
            `/modules/SpiceImports/upf?separator=${this.separator}&enclosure=${this.enclosure}`, true);
        request.setRequestHeader('OAuth-Token', this.session.authData.sessionId);
        request.send(data);
        return retSub.asObservable();
    }

    clearFile() {
        this.backend.deleteRequest('/modules/SpiceImports/upf', {filemd5: this.objectimport.fileId});

        // clear the file
        this.objectimport.fileName = '';
        this.objectimport.fileId = '';

        // clear the laoded content
        this.objectimport.fileHeader = [];
        this.objectimport.fileData = [];
        this.objectimport.fileRows = '';

        this.objectimport.resetSettings();

    }

}
