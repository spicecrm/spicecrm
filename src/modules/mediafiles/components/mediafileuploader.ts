/**
 * @module ModuleMediaFiles
 */
import {Component, ViewChild} from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {Subject, Observable} from 'rxjs';
import {toast} from "../../../services/toast.service";
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {SystemInputMedia} from '../../../systemcomponents/components/systeminputmedia';

@Component({
    selector: 'media-file-uploader',
    templateUrl: '../templates/mediafileuploader.html',
    providers: [mediafiles, model, view]
})
export class MediaFileUploader {

    /**
     * The upload progress in percent.
     */
    public theProgress = 0;

    /**
     * Should the meta data be queried? Name, Copyright, ... Otherwise only the image input field will be displayed.
     */
    public noMetaData = false;

    /**
     * Observable for submitting the ID of the new media file.
     */
    public answer: Observable<boolean | string> = null;

    /**
     * Subject for submitting the ID of the new media file.
     */
    public answerSubject: Subject<boolean | string> = null;

    /**
     * Reference for the modal.
     */
    public self: any;

    /**
     * Indicates whether saving is in progress.
     */
    public isSaving = false;

    /**
     * Indicates whether the user is currently editing.
     */
    public isEditing = true;

    /**
     * Reference to the input component. Is used to access public properties of the component.
     */
    @ViewChild(SystemInputMedia, {static: false}) public inputMedia;

    /**
     * Reference to the meta data of the media, delivered from SystemInputMedia.
     */
    public mediaMetaData;

    /**
     * The ID of the fieldset.
     */
    public fieldsetId: string;

    constructor(public mediafiles: mediafiles, public metadata: metadata, public backend: backend, public lang: language, public toast: toast, public model: model, public view: view) {

        this.answerSubject = new Subject<boolean>();
        this.answer = this.answerSubject.asObservable();

        this.model.module = 'MediaFiles';
        this.model.id = this.model.generateGuid();
        this.model.initialize();

        this.model.setField('id', this.model.id);

        this.view.isEditable = true;
        this.view.setEditMode();

        let componentConfig = this.metadata.getComponentConfig('MediaFileUploader', 'MediaFiles');
        this.fieldsetId = componentConfig.fieldset;

    }

    /**
     * Handler when the cancel button has been clicked.
     */
    public cancel(): void {
        this.model.cancelEdit();
        this.answerSubject.next(false);
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * Is everything ready to save?
     */
    public get canSave(): boolean {
        return this.mediaMetaData && !this.isSaving;
    }

    /**
     * simple getter to get the image
     */
    get image() {
        let file = this.model.getField('file');
        return file ? this.model.getField('filetype')+'|'+file : undefined;
    }

    /**
     * setter to set the image data (base64) and the metadata
     * @param imageData
     */
    set image( imageData: string ) {
        // The image comes in the format 'filetype|base64filedata', like 'jpeg|/9j/4AAQSkZJRgABA...'
        let positionDelimiter = imageData.indexOf('|');
        this.model.setField('file', imageData.substring( positionDelimiter + 1 ));
        this.mediaMetaData = this.inputMedia.mediaMetaData;
        if (!this.model.getField('name')) {
            this.model.setField('name', this.mediaMetaData.filename.replace(/\.[^\.]+$/, '').replace(/_/, ' '));
        }
        this.model.setField('filetype', imageData.substring( 0, positionDelimiter ));
    }

    /**
     * After the user finished his input operations: Save the media files model to the backend.
     */
    public save(): void {
        if (!this.canSave) return;
        this.isSaving = true;

        this.model.savingProgress.subscribe(progress => this.theProgress = progress);
        if (this.model.validate()) {
            this.view.setViewMode();
            this.isEditing = false;
            this.model.save().subscribe(() => {
                this.answerSubject.next(this.model.id);
                this.answerSubject.complete();
                window.setTimeout(() => this.self.destroy(), 2000); // After the upload is complete: Let the user time to recognize this before destroying the component.
            });
        } else this.isSaving = false;
    }

    /**
     * Handler when the x-button has been clicked.
     */
    public onModalEscX() {
        if (!this.isSaving) this.cancel();
        return false;
    }

}
