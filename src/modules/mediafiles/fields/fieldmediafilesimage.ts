/**
 * @module ModuleMediaFiles
 */
import {Component, OnChanges, Input, ElementRef, ViewChild} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {mediafiles} from '../../../services/mediafiles.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";

import {SystemInputMedia} from "../../../systemcomponents/components/systeminputmedia";

@Component({
    templateUrl: '../templates/fieldmediafilesimage.html',
    providers: [mediafiles]
})
export class fieldMediaFilesImage extends fieldGeneric {

    /**
     * reference to the image upload component
     */
    @ViewChild(SystemInputMedia) public systemInputMedia: SystemInputMedia;

    /**
     * the base64 image string
     */
    public _value: string;

    constructor(
        public model: model,
        public modal: modal,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public mediafiles: mediafiles,
    ) {
        super(model, view, language, metadata, router);

        // load the image
        this.initialize();
    }

    /**
     * getter for the value overwritten to access the buffered value loaded from the backend for the image
     */
    get value() {
        return this._value;
    }

    /**
     * setter fot the value
     *
     * @param value
     */
    set value(value) {

        let fieldValues: any = {};

        fieldValues.file = value;
        fieldValues.filetype = this.systemInputMedia.mediaMetaData.mimetype;

        let name = this.model.getField('name');
        if (!name) {
            fieldValues.name = this.systemInputMedia.mediaMetaData.filename;
            this.model.setFields(fieldValues);
        } else if (!this._value) {
            this.modal.prompt('confirm', this.language.getLabel('MSG_OVERWRITE_FILENAME', '', 'long'), this.language.getLabel('MSG_OVERWRITE_FILENAME')).subscribe(response => {
                if ( response ) {
                    fieldValues.name = this.systemInputMedia.mediaMetaData.filename;
                }
                this.model.setFields(fieldValues);
            });
        }

        this._value = value;

    }

    /**
     * if we have a model id and the model is not new try to laod the image
     */
    public initialize() {
        if (!this.model.isNew) {
            this.loadImage();

            // subscribe to the cancel message
            this.subscriptions.add(this.model.canceledit$.subscribe(cancelled => {
                this._value = null;
                this.loadImage();
            }));
        }
    }

    /**
     * loads the image from the backend
     */
    public loadImage() {
        this.mediafiles.getImageBase64(this.model.id).subscribe(image => {
            this._value = image.img;
        });
    }

}
