/**
 * @module ObjectComponents
 */
import {Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';
import {modelattachments} from "../../services/modelattachments.service";
import {Observable, Subject} from "rxjs";
import {configurationService} from "../../services/configuration.service";
import {toast} from "../../services/toast.service";
import {session} from "../../services/session.service";
import {helper} from "../../services/helper.service";
import {backend} from "../../services/backend.service";
import {modelutilities} from "../../services/modelutilities.service";
import {Router} from "@angular/router";
import {broadcast} from "../../services/broadcast.service";
import {metadata} from "../../services/metadata.service";
import {recent} from "../../services/recent.service";
import {modal} from "../../services/modal.service";
import {navigation} from "../../services/navigation.service";

/**
 * @ignore
 */
declare var moment;

@Component({
    selector: 'object-activitiytimeline',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimeline.html',
    providers: [activitiyTimeLineService, modelattachments]
})
export class ObjectActivitiyTimeline implements OnInit, OnDestroy {

    public displayAddContainer: boolean = false;
    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    private componentconfig: any = {};
    private uploadData: any = {
        fileName: '',
        uploading: false,
        progress: undefined
    };
    private displayaggregates = {
        Activities: false,
        History: false
    };

    constructor(private model: model,
                private language: language,
                private activitiyTimeLineService: activitiyTimeLineService,
                private configurationService: configurationService,
                private session: session,
                private backend: backend,
                private helper: helper,
                private toast: toast,
                private broadcast: broadcast,
                public metadata: metadata,
                public utils: modelutilities,
                private recent: recent,
                private router: Router,
                private modal: modal,
                private navigation: navigation,
                public injector: Injector) {

    }

    /**
     * getter for the searchterm
     */
    get ftsSearchTerm() {
        return this.activitiyTimeLineService.filters.searchterm;
    }

    /**
     * setter for the searchterm. When entered will also start a reload
     *
     * @param searchterm the searchterm
     */
    set ftsSearchTerm(searchterm) {
        this.activitiyTimeLineService.filters.searchterm = searchterm;
        this.activitiyTimeLineService.reload();
    }

    public ngOnInit() {
        this.parentModule = this.model.module;
        this.parentId = this.model.id;

        this.activitiyTimeLineService.parent = this.model;

        if (!this.componentconfig.hideaddcontainer) {
            this.displayAddContainer = true;
        }

        if (this.componentconfig.usefts) this.activitiyTimeLineService.usefts = true;
        if (this.componentconfig.defaultentries) this.activitiyTimeLineService.defaultLimit = this.componentconfig.defaultentries;

    }

    public ngOnDestroy() {
        this.activitiyTimeLineService.stopSubscriptions();
    }

    public reload() {
        this.activitiyTimeLineService.getTimeLineData('Activities');
        this.activitiyTimeLineService.getTimeLineData('History');
    }

    public loadMore(module) {
        this.activitiyTimeLineService.getMoreTimeLineData(module, 5);
    }

    /*
    * Check if the dropped files are in MSG extension call the add them
    * @param files
    * @return void
    */
    private handleDroppedFiles(files: FileList) {
        let msgFiles = [];
        for (let file in files) {
            if (files.hasOwnProperty(file)) msgFiles.push(files[file]);
        }
        if (msgFiles.length > 0) {
            this.uploadData.uploading = true;
            this.addEmailsFromMsgFiles(msgFiles).subscribe(
                next => {
                    this.uploadData.fileName = next.fileName;
                    this.uploadData.progress = next.progress;
                },
                () => {
                    this.toast.sendToast(this.language.getLabel('ERR_UPLOAD_FAILED'), 'error');
                },
                () => {
                    this.activitiyTimeLineService.getTimeLineData('History');
                    this.uploadData.uploading = false;
                }
            );
        }
    }

    /*
    * handle sending the files to backend
    * @param files
    * @return Observable
    */
    private addEmailsFromMsgFiles(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();
        let maxSize = this.configurationService.getSystemParamater('upload_maxsize');

        for (let file of files) {

            // check max filesize
            if (maxSize && file.size > maxSize) {
                this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [file.name, this.helper.humanFileSize(maxSize)]), 'error');
                continue;
            }
            let isMsgFile = file.name.substring(file.name.length - 4).toLowerCase() == '.msg';

            this.readFile(file).subscribe(filecontent => {
                let request = new XMLHttpRequest();
                let resp: any = {};
                request.onreadystatechange = (scope: any = this) => {
                    if (request.readyState == 4) {
                        try {
                            if (!isMsgFile) {
                                this.addNewNote(file.name, retSub);
                            } else {
                                retSub.complete();
                            }
                        } catch (e) {
                            resp = {
                                status: "error",
                                data: "Unknown error occurred: [" + request.responseText + "]"
                            };
                        }
                    }
                };

                request.upload.addEventListener("progress", e => {
                    retSub.next({
                        progress: Math.round(e.loaded / e.total * 100),
                        fileName: file.name,
                        isMsg: isMsgFile
                    });
                }, false);

                let url = this.configurationService.getBackendUrl() + '/module/Notes/' + this.model.id + '/noteattachment';

                // change the url to the "add email" url if the file type is msg
                if (isMsgFile) {
                    url = this.configurationService.getBackendUrl() + "/module/Emails/msg";
                }

                request.open("POST", url, true);
                request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                let fileBody = {
                    file: file.filecontent,
                    filename: file.name,
                    filemimetype: file.type ? file.type : 'application/octet-stream',
                    beanId: this.model.id,
                    beanModule: this.model.module
                };

                request.send(JSON.stringify(fileBody));
            });
        }

        return retSub.asObservable();
    }

    /*
    * handle reading the file content
    * @param file
    * @return Observable
    */
    private readFile(file): Observable<any> {
        let responseSubject = new Subject<any>();
        let reader: any = new FileReader();
        reader.file = file;
        reader.onloadend = (e) => {
            let filecontent = reader.result.toString();
            filecontent = filecontent.substring(filecontent.indexOf('base64,') + 7);

            let file = reader.file;
            file.filecontent = filecontent;
            responseSubject.next(file);
            responseSubject.complete();
        };
        reader.readAsDataURL(file);
        return responseSubject.asObservable();
    }

    /*
    * create a new instance of the model service to handle adding a new note
    * fill in the necessary field and add the note
    * complete the upload process to refresh the history list
    * @param fileName
    * @param fileRetrieveSubject
    */
    private addNewNote(fileName, fileRetrieveSubject) {
        if (!fileName || fileName.length == 0) return;

        let noteModelInstance = new model(
            this.backend,
            this.broadcast,
            this.metadata,
            this.utils,
            this.session,
            this.recent,
            this.router,
            this.toast,
            this.language,
            this.modal,
            this.navigation,
            this.configurationService,
            this.injector
        );
        noteModelInstance.module = 'Notes';
        noteModelInstance.initialize(this.activitiyTimeLineService.parent);
        noteModelInstance.startEdit(false);
        noteModelInstance.setField('name', fileName);
        noteModelInstance.setField('filename', fileName);
        noteModelInstance.save(true).subscribe(
            () => {
                fileRetrieveSubject.complete();
                noteModelInstance = null;
            },
            () => {
                fileRetrieveSubject.complete();
                noteModelInstance = null;
            }
        );
    }
}
