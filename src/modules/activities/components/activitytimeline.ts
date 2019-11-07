/**
 * @module ObjectComponents
 */
import {Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {activitiyTimeLineService} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";
import {Observable, Subject} from "rxjs";
import {configurationService} from "../../../services/configuration.service";
import {toast} from "../../../services/toast.service";
import {session} from "../../../services/session.service";
import {helper} from "../../../services/helper.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {Router} from "@angular/router";
import {broadcast} from "../../../services/broadcast.service";
import {metadata} from "../../../services/metadata.service";
import {recent} from "../../../services/recent.service";
import {modal} from "../../../services/modal.service";
import {navigation} from "../../../services/navigation.service";

/**
 * @ignore
 */
declare var moment;

@Component({
    selector: 'activitytimeline',
    templateUrl: './src/modules/activities/templates/activitytimeline.html',
    providers: [activitiyTimeLineService, modelattachments]
})
export class ActivityTimeline implements OnInit, OnDestroy {

    public displayAddContainer: boolean = false;
    @Input() private parentModule: string = '';
    @Input() private parentId: string = '';
    private componentconfig: any = {};
    private uploadData: any = {
        fileName: '',
        fileIcon: {},
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

    get progressBarStyle() {
        return {
            width: (this.uploadData.progress || 0) + '%'
        };
    }

    get maxSize() {
        return this.configurationService.getSystemParamater('upload_maxsize');
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
        let noteFiles = [];
        for (let file in files) {
            if (files.hasOwnProperty(file)) {
                if (this.fileSizeExceeded(files[file])) {
                    this.toast.sendToast(
                        this.language.getLabelFormatted(
                            'LBL_EXCEEDS_MAX_UPLOADFILESIZE',
                            [files[file].name, this.helper.humanFileSize(this.maxSize)]),
                        'error'
                    );
                } else {
                    // push the files to the appropriate arrays
                    if (files[file].name.substring(files[file].name.length - 4).toLowerCase() == '.msg') {
                        msgFiles.push(files[file]);
                    } else {
                        noteFiles.push(files[file]);
                    }
                }
            }
        }
        if (msgFiles.length > 0) {
            this.uploadData.uploading = true;
            this.uploadFiles(msgFiles, this.model.module, this.model.id).subscribe(
                next => {
                    this.uploadData.fileName = next.fileName;
                    this.uploadData.progress = next.progress;
                    this.setFileIcon(next.fileName, next.fileType);
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

        if (noteFiles.length > 0) this.addNotesFromFiles(noteFiles);
    }

    /*
    * handle sending the files to backend
    * @param files
    * @return Observable
    */
    private uploadFiles(files, moduleName, moduleId): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();

        for (let file of files) {

            this.readFile(file).subscribe(() => {
                let request = new XMLHttpRequest();
                let resp: any = {};
                request.onreadystatechange = (scope: any = this) => {
                    if (request.readyState == 4) {
                        try {
                            retSub.complete();
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
                        fileType: file.type

                    });
                }, false);

                let url = this.configurationService.getBackendUrl() + `/module/Notes/${moduleId}/noteattachment`;

                // change the url to the "add email" url if the file type is msg
                if (moduleName != 'Notes') url = this.configurationService.getBackendUrl() + "/module/Emails/msg";

                request.open("POST", url, true);
                request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                let fileBody = {
                    file: file.filecontent,
                    filename: file.name,
                    filemimetype: file.type ? file.type : 'application/octet-stream',
                    beanId: moduleId,
                    beanModule: moduleName
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
        reader.onloadend = () => {
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
    * create a new instance of the model service and pass it to the add note handler
    * @param files
    */
    private addNotesFromFiles(files) {

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
        this.addNewNote(noteModelInstance, files);
    }

    /*
    * recursive method to handle adding notes with their attachments synchronously one after another
    * @param noteModel
    * @param files
    * @param currentIndex
    */
    private addNewNote(noteModel, files, currentIndex = 0) {
        noteModel.reset();
        noteModel.module = 'Notes';
        noteModel.initialize(this.activitiyTimeLineService.parent);
        noteModel.startEdit(false);
        noteModel.setField('name', files[currentIndex].name);
        noteModel.setField('filename', files[currentIndex].name);
        noteModel.setField('file_mime_type', files[currentIndex].type ? files[currentIndex].type : 'application/octet-stream');
        noteModel.save(true).subscribe(
            res => {
                this.uploadData.uploading = true;
                this.uploadFiles([files[currentIndex]], noteModel.module, noteModel.id).subscribe(
                    next => {
                        this.uploadData.fileName = next.fileName;
                        this.uploadData.progress = next.progress;
                        this.setFileIcon(next.fileName, next.fileType);
                    },
                    () => {
                        this.toast.sendToast(this.language.getLabel('ERR_UPLOAD_FAILED'), 'error');
                    },
                    () => {
                        if ((currentIndex + 1) >= files.length) {
                            this.activitiyTimeLineService.getTimeLineData('History');
                            this.uploadData.uploading = false;
                        } else {
                            this.addNewNote(noteModel, files, currentIndex + 1);
                        }
                    }
                );
            }, () => this.addNewNote(noteModel, files, currentIndex + 1));
    }

    /*
    * set the file icon for the upload progressbar
    * @param fileName
    * @param fileType
    */
    private setFileIcon(fileName, fileType) {
        if (fileType == this.uploadData.fileIcon.fileType) return;
        let icon = this.helper.determineFileIcon(fileType);
        if (icon == 'unknown') {
            let nameParts = fileName.split('.');
            let type = nameParts.splice(-1, 1)[0];
            if (type.toLowerCase() == 'msg') {
                this.uploadData.fileIcon = {
                    icon: 'email',
                    sprite: 'standard',
                    fileType: fileType
                };
            }
        }
        this.uploadData.fileIcon = {
            icon: icon,
            sprite: 'doctype',
            fileType: fileType
        };
    }

    /*
    * @param file
    * @return boolean
    */
    private fileSizeExceeded(file) {
        return this.maxSize && file.size > this.maxSize;
    }
}
