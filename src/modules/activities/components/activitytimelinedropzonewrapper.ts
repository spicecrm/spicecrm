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
 * @module ModuleActivities
 */
import {Component, SkipSelf} from '@angular/core';
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {helper} from "../../../services/helper.service";
import {configurationService} from "../../../services/configuration.service";
import {Observable, Subject} from "rxjs";
import {model} from "../../../services/model.service";
import {activitiytimeline} from "../../../services/activitiytimeline.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'activity-timeline-drop-zone-wrapper',
    templateUrl: './src/modules/activities/templates/activitytimelinedropzonewrapper.html',
    viewProviders: [model]
})
export class ActivityTimelineDropZoneWrapper {

    private uploadData: any = {
        fileName: '',
        fileIcon: {},
        uploading: false,
        progress: undefined
    };

    constructor(private language: language,
                private toast: toast,
                private configurationService: configurationService,
                private activitiytimeline: activitiytimeline,
                private noteModel: model,
                @SkipSelf() private model: model,
                private session: session,
                private helper: helper) {
    }

    /**
     * @return upload_maxsize: number
     */
    get maxSize() {
        return this.configurationService.getSystemParamater('upload_maxsize');
    }

    /**
     * @return style: object
     */
    get progressBarStyle() {
        return {
            width: (this.uploadData.progress || 0) + '%'
        };
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
                    this.activitiytimeline.getTimeLineData('History');
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
                            // if we have a note we first attached the file .. and now need to complete the MD5 Hash
                            if (moduleName == 'Notes') {
                                let retVal = JSON.parse(request.response);
                                retSub.next({
                                    progress: 100,
                                    fileName: file.name,
                                    fileType: file.type,
                                    fileMD5: retVal[0].filemd5
                                });
                            }
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
                        fileType: file.type,
                        fileMD5: file.filemd5

                    });
                }, false);

                // let url = this.configurationService.getBackendUrl() + `/module/Notes/${moduleId}/noteattachment`;
                let url = this.configurationService.getBackendUrl() + '/common/spiceattachments';

                // change the url to the "add email" url if the file type is msg
                if (moduleName != 'Notes') url = this.configurationService.getBackendUrl() + "/module/Emails/msg";

                request.open("POST", url, true);
                request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                let fileBody = {
                    file: file.filecontent,
                    filename: file.name,
                    filemimetype: file.type ? file.type : 'application/octet-stream',
                    filemd5: undefined,
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
    * create a new instance of the model service and pass it to the add note handler
    * @param files
    */
    private addNotesFromFiles(files) {
        this.addNewNote(files);
    }

    /*
    * recursive method to handle adding notes with their attachments synchronously one after another
    * @param this.noteModel
    * @param files
    * @param currentIndex
    */
    private addNewNote(files, currentIndex = 0) {

        // prepare the note
        this.noteModel.reset();
        this.noteModel.module = 'Notes';
        this.noteModel.initialize(this.activitiytimeline.parent);
        this.noteModel.startEdit(false);
        this.noteModel.setField('name', files[currentIndex].name);
        this.noteModel.setField('file_name', files[currentIndex].name);
        this.noteModel.setField('file_mime_type', files[currentIndex].type ? files[currentIndex].type : 'application/octet-stream');
        this.uploadData.uploading = true;

        // upload the file
        this.uploadFiles([files[currentIndex]], this.noteModel.module, this.noteModel.id).subscribe(
            next => {
                this.uploadData.fileName = next.fileName;
                this.uploadData.progress = next.progress;
                this.setFileIcon(next.fileName, next.fileType);
                // if we get an MD5 back set it to the note
                if (next.fileMD5) {
                    this.noteModel.setField('file_md5', next.fileMD5);
                }
            },
            () => {
                this.toast.sendToast(this.language.getLabel('ERR_UPLOAD_FAILED'), 'error');
            },
            () => {
                // save the note and continue to the next
                this.noteModel.save().subscribe(succ => {
                    if ((currentIndex + 1) >= files.length) {
                        this.activitiytimeline.getTimeLineData('History');
                        this.uploadData.uploading = false;
                    } else {
                        this.addNewNote(files, currentIndex + 1);
                    }
                });

            }
        );
        /*

        this.noteModel.save(true).subscribe(
            res => {

            }, () => this.addNewNote(files, currentIndex + 1));
         */
    }

    /*
    * @param file
    * @return boolean
    */
    private fileSizeExceeded(file) {
        return this.maxSize && file.size > this.maxSize;
    }
}
