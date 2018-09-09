import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

import {Subject, Observable} from 'rxjs';

@Component({
    selector: 'field-file',
    templateUrl: './app/objectfields/templates/fieldfile.html'
})
export class fieldFile extends fieldGeneric{

    @ViewChild('fileupload', {read: ViewContainerRef}) fileupload: ViewContainerRef;
    showUploadModal: boolean = false;
    theFile: string = '';
    theProgress: number = 0;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private configurationService: configurationService, private session: session) {
        super(model, view, language, metadata, router);
    }

    uploadFile(){
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    doupload(files){
        this.showUploadModal = true;
        this.theFile = files[0].name;
        this.uploadAttachments(files).subscribe((retVal: any) => {
            if (retVal.progress) {
                this.theProgress = retVal.progress.loaded / retVal.progress.total * 100
            } else if (retVal.complete) {
                this.value = this.theFile;
            }
        }, error => {

            this.closeUploadPopup();
        }, () => this.closeUploadPopup());
    }

    removeFile(){
        this.value = '';
    }

    closeUploadPopup() {
        this.showUploadModal = false;
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
                    retSub.next({complete: true});
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };
                }
            }
        };

        request.upload.addEventListener('progress', function (e: any) {
            retSub.next({progress: {total: e.total, loaded: e.loaded}});
            // console.log('progress' + e.loaded + '/' + e.total + '=' + Math.ceil(e.loaded/e.total) * 100 + '%');
        }, false);

        request.open('POST', this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment', true);
        request.setRequestHeader('OAuth-Token', this.session.authData.sessionId);
        request.send(data);

        return retSub.asObservable();
    }

    getBarStyle() {
        return {
            width: this.theProgress + '%'
        }
    }

    downloadAttachment(id) {
        let params: Array<string> = [];
        params.push('sessionid=' + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment/download?' + params.join('&'),
            '_blank' // <- open in a new window
        );
    }

    preventdefault(event: any) {
        if((event.dataTransfer.items.length == 1 && event.dataTransfer.items[0].kind === 'file') || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length == 1)
            this.doupload(files);
    }
}