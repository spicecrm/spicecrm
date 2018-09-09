import { Component, Input, Renderer, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';
import {Subject, Observable} from 'rxjs';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'media-file-uploader',
    templateUrl: './app/modules/mediafiles/templates/mediafileuploader.html',
    providers: [ mediafiles ],
    styles: [
        ':host {height: 100%;}',
        ':host >>> div.uploadbar {margin-left:-16px;margin-right:-16px;margin-top:16px;margin-bottom:-16px;width:calc(100% + 32px);height:8px;}',
        ':host >>> div.uploadprogress {width: 90%;height: 100%;background-color: red;}'
    ]
    //styles: [ 'img.thumb { background-color: #fff; border: 1px solid #d8dde6; padding: 1px; margin-right: 3px; width: 32px; height: 32px; }' ]
})
export class MediaFileUploader implements AfterViewInit {

    theProgress: number = 0;
    uploadFinished = false;
    filedata: any = {};
    statustext: string;
    noMetaData: boolean = false;
    fileIsSelected: boolean = false;
    category: string;

    answer: Observable<boolean> = null;
    answerSubject: Subject<boolean> = null;

    self: any;

    @ViewChild( 'fileupload', { read: ViewContainerRef }) fileupload: ViewContainerRef;

    constructor ( private mediafiles: mediafiles, private backend: backend, private language: language, private toast:toast, private renderer: Renderer ) {
        this.answerSubject = new Subject<boolean>();
        this.answer = this.answerSubject.asObservable();
    }

    ngAfterViewInit() {
        this.triggerFileSelectionDialog();
    }

    triggerFileSelectionDialog() {
        // triggers file selection dialog of the browser (using the hidden input field)
        let event = new MouseEvent( 'click', { bubbles: true } );
        this.renderer.invokeElementMethod( this.fileupload.element.nativeElement, 'dispatchEvent', [event] );
    }

    fileSelected() {
        let files = this.fileupload.element.nativeElement.files;
        this.fileIsSelected = files.length > 0;
        this.statustext = 'Uploading ' + files[0].name + ' …';
        this.mediafiles.uploadFile( files ).subscribe((retVal: any) => {
            if ( retVal.progress )
                this.theProgress = retVal.progress.loaded / retVal.progress.total * 100;
            else
                this.filedata = retVal.filedata;
        }, error => {
            this.toast.sendToast( this.language.getLabel( 'ERR_UPLOAD_FAILED' ));
            this.cancel();
        }, () => {
            this.uploadFinished = true;
            this.filedata.category = this.category;
            if ( this.noMetaData ) {
                this.filedata.name = this.filedata.id;
                this.finishDataInput();
            } else {
                this.filedata.name = files[0].name;
                this.statustext = this.language.getLabel( 'MSG_IMGUPLOADED_INPUTDATA' );
                this.mediafiles.loadCategories();
            }
        });
    }

    finishDataInput() {
        this.filedata.upload_completed = 1;
        this.backend.postRequest('module/MediaFiles/'+this.filedata.id, null, this.filedata );
        this.answerSubject.next( this.filedata.id );
        this.answerSubject.complete();
        this.self.destroy();
    }

    cancel() {
        // todo: Spezial-POST-Request um Datei tatsächlich wieder zu löschen - und Datensatz, aber nur wenn this.uploadFinished === true
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    onModalEscX() {
        this.cancel();
    }

    getBarStyle() {
        return {
            width: this.theProgress + '%'
        }
    }

}