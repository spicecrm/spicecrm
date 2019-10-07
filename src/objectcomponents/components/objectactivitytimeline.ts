/**
 * @module ObjectComponents
 */
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';
import {modelattachments} from "../../services/modelattachments.service";
import {Observable, Subject} from "rxjs";
import {configurationService} from "../../services/configuration.service";
import {toast} from "../../services/toast.service";
import {session} from "../../services/session.service";
import {helper} from "../../services/helper.service";

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
    private displayaggregates = {
        Activities: false,
        History: false
    };

    constructor(private model: model,
                private language: language,
                private activitiyTimeLineService: activitiyTimeLineService,
                private configurationService: configurationService,
                private session: session,
                private helper: helper,
                private toast: toast) {

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
            if (files.hasOwnProperty(file) && files[file].name.substring(files[file].name.length - 4).toLowerCase() == '.msg') {
                msgFiles.push(files[file]);
            }
        }
        if (msgFiles.length > 0) this.addEmailsFromMsgFiles(msgFiles);
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

            let newfile = {
                date: new moment(),
                file: '',
                file_mime_type: file.type ? file.type : 'application/octet-stream',
                filesize: file.size,
                filename: file.name,
                id: '',
                text: '',
                thumbnail: '',
                user_id: '1',
                user_name: 'admin',
                uploadprogress: 0
            };

            this.readFile(file).subscribe(filecontent => {
                let request = new XMLHttpRequest();
                let resp: any = {};
                request.onreadystatechange = (scope: any = this) => {
                    if (request.readyState == 4) {
                        try {
                            let retVal = JSON.parse(request.response);

                            newfile.id = retVal[0].id;
                            newfile.thumbnail = retVal[0].thumbnail;
                            newfile.user_id = retVal[0].user_id;
                            newfile.user_name = retVal[0].user_name;
                            delete (newfile.uploadprogress);

                            retSub.next({files: retVal});
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
                    newfile.uploadprogress = Math.round(e.loaded / e.total * 100);
                    retSub.next({progress: {total: e.total, loaded: e.loaded}});
                }, false);
                let url = this.configurationService.getBackendUrl() + "/module/Emails/msg";
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
}
