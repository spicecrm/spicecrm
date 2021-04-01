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
 * @module ObjectFields
 */
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {libloader} from '../../services/libloader.service';
import {Router} from '@angular/router';
import {fieldGeneric} from './fieldgeneric';

declare var SignaturePad: any;

/**
 * documentation: https://spicecrm.gitbooks.io/spicecrm-ui/content/component-directory/fields/signature.html
 * created by Sebastian Franz
 */
@Component({
    selector: 'field-signature',
    templateUrl: './src/objectfields/templates/fieldsignature.html'
})
export class FieldSignatureComponent extends fieldGeneric implements AfterViewInit {
    @ViewChild('canvas', {static: true}) private canvas: ElementRef;
    private pad: any;

    private display_name_field: string;
    private signature_height: number = 200;
    private signature_width: number = 400;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public libloader: libloader,
        public router: Router,
    ) {
        super(model, view, language, metadata, router);
    }

    public ngAfterViewInit() {
        if (this.config) {
            if (this.config.signature_width > 0) {
                this.signature_width = this.config.signature_width;
            }
            if (this.config.signature_height > 0) {
                this.signature_height = this.config.signature_height;
            }
            this.display_name_field = this.config.display_name_field;
        }
        // console.log('starting loading libs...');
        this.libloader.loadLib('signature_pad').subscribe(
            (next) => {
                this.pad = new SignaturePad(
                    (this.canvas.nativeElement as HTMLCanvasElement),
                    {
                        backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed if only saving as PNG or SVG
                    }
                );

                // waiting for model to be loaded...
                if (this.model.isLoading || !this.model.id) {
                    this.model.data$.subscribe(
                        res => {
                            this.pad.fromDataURL(this.src);
                        }
                    );
                } else {
                    this.pad.fromDataURL(this.src);
                }
            }
        );
    }

    get config() {
        return this.fieldconfig;
    }

    get src(): string {
        if (this.value) {
            return 'data:image/jpeg;base64,' + this.value;
        } else {
            return '';
        }
    }

    private undo() {
        let data = this.pad.toData();
        if (data) {
            data.pop(); // remove the last dot or line
            this.pad.fromData(data);
            this.convert();
        }
    }

    private clear() {
        this.pad.clear();
        this.convert();
    }

    private convert() {
        let data = this.pad.toDataURL('image/jpeg');
        let parts = data.split("base64,"); // split to only save the part with the base64 coded image...
        if (this.pad.isEmpty()) {
            // don't save a white image...
            this.value = "";
        } else if (parts.length != 2) {
            console.warn('Failed to parse base64 code from data:', data);
            this.value = "";
        } else {
            data = parts[1];
            this.value = data;
        }
    }
}
