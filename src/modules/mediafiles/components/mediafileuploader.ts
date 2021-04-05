/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/modules/mediafiles/templates/mediafileuploader.html',
    providers: [mediafiles, model, view]
})
export class MediaFileUploader {

    /**
     * The upload progress in percent.
     */
    private theProgress = 0;

    /**
     * Should the meta data be queried? Name, Copyright, ... Otherwise only the image input field will be displayed.
     */
    private noMetaData = false;

    /**
     * Observable for submitting the ID of the new media file.
     */
    private answer: Observable<boolean | string> = null;

    /**
     * Subject for submitting the ID of the new media file.
     */
    private answerSubject: Subject<boolean | string> = null;

    /**
     * Reference for the modal.
     */
    private self: any;

    /**
     * Indicates whether saving is in progress.
     */
    private isSaving = false;

    /**
     * Indicates whether the user is currently editing.
     */
    private isEditing = true;

    /**
     * Reference to the input component. Is used to access public properties of the component.
     */
    @ViewChild(SystemInputMedia, {static: false}) public inputMedia;

    /**
     * Reference to the meta data of the media, delivered from SystemInputMedia.
     */
    private mediaMetaData;

    /**
     * The ID of the fieldset.
     */
    private fieldsetId: string;

    constructor(private mediafiles: mediafiles, private metadata: metadata, private backend: backend, private lang: language, private toast: toast, public model: model, public view: view) {

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
    private cancel(): void {
        this.model.cancelEdit();
        this.answerSubject.next(false);
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * Is everything ready to save?
     */
    private get canSave(): boolean {
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
    private save(): void {
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
