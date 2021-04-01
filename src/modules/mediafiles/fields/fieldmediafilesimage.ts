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
    templateUrl: './src/modules/mediafiles/templates/fieldmediafilesimage.html',
    providers: [mediafiles]
})
export class fieldMediaFilesImage extends fieldGeneric {

    /**
     * reference to the image upload component
     */
    @ViewChild(SystemInputMedia) private systemInputMedia: SystemInputMedia;

    /**
     * the base64 image string
     */
    private _value: string;

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
    private initialize() {
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
    private loadImage() {
        this.mediafiles.getImageBase64(this.model.id).subscribe(image => {
            this._value = image.img;
        });
    }

}
