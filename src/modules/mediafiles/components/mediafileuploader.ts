/**
 * @module ModuleMediaFiles
 */
import { Component, ViewChild } from '@angular/core';
import { mediafiles } from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';
import { Subject, Observable } from 'rxjs';
import { toast } from "../../../services/toast.service";
import { model } from '../../../services/model.service';
import { view } from '../../../services/view.service';
import { metadata } from '../../../services/metadata.service';
import { SystemInputMedia } from '../../../systemcomponents/components/systeminputmedia';

@Component({
    selector: 'media-file-uploader',
    templateUrl: './src/modules/mediafiles/templates/mediafileuploader.html',
    providers: [ mediafiles, model, view ],
    styles: [
        ':host {height: 100%;}',
        ':host >>> div.uploadbar {margin-left:-16px;margin-right:-16px;margin-top:16px;margin-bottom:-16px;width:calc(100% + 32px);height:8px;}',
        ':host >>> div.uploadprogress {width: 90%;height: 100%;background-color: red;}'
    ]
})
export class MediaFileUploader {

    private theProgress: number = 0;
    private noMetaData: boolean = false;

    private answer: Observable<boolean|string> = null;
    private answerSubject: Subject<boolean|string> = null;

    private self: any;

    private mediaReady = false;

    private isSaving = false;
    private tagsEditing = true;
    @ViewChild(SystemInputMedia) public inputMedia;

    private mediaMetaData;

    constructor( private mediafiles: mediafiles, private metadata: metadata, private backend: backend, private language: language, private toast: toast, public model: model, public view: view ) {

        this.answerSubject = new Subject<boolean>();
        this.answer = this.answerSubject.asObservable();

        this.model.module = 'MediaFiles';
        this.model.id = this.model.generateGuid();
        this.model.initialize();

        this.model.setField('id', this.model.id );

        this.view.isEditable = true;
        this.view.setEditMode();

        this.model.setField('tags', ['Technik','Natur','Bauwesen']);

    }

    private cancel(): void {
        this.model.cancelEdit();
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    public onModalEscX(): boolean {
        if ( !this.isSaving ) this.cancel();
        return true;
    }

    private get canSave(): boolean {
        return this.mediaReady && !this.isSaving;
    }

    private save(): void {
        if ( !this.canSave ) return;
        this.isSaving = true;
        this.mediaMetaData = this.inputMedia.getMetaData();
        this.model.setField('file', this.inputMedia.getImage() );
        this.model.setField('mediatype', this.mediaMetaData.mediatype );
        this.model.setField('filetype', this.mediaMetaData.fileformat );
        this.model.setField('upload_completed', 1 );
        this.model.savingProgress.subscribe( progress => this.theProgress = progress );
        if ( this.model.validate() ) {
            this.view.setViewMode();
            this.model.save().subscribe( () => {
                this.answerSubject.next( this.model.id );
                this.answerSubject.complete();
                window.setTimeout( () => this.self.destroy(), 2000 );
            } );
        } else this.isSaving = false;
    }

    public set tags( tags ) {
        this.model.setField('tags', tags);
    }

    public get tags() {
        return this.model.getField('tags');
    }

    public ch(x) {
        console.log(x);
        console.log(this.model.data.tags);
    }

}
