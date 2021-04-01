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
import {
    Component,
    ElementRef,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    Renderer2, ViewChild
} from '@angular/core';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { Router } from '@angular/router';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { fieldGeneric } from './fieldgeneric';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { fieldLabel } from './fieldlabel';
import { SystemInputMedia } from '../../systemcomponents/components/systeminputmedia';

@Component( {
    selector: 'field-image',
    templateUrl: './src/objectfields/templates/fieldimage.html',
})
export class fieldImage extends fieldGeneric implements OnInit, AfterViewInit {

    /**
     * loads the input component
     */
    @ViewChild(fieldLabel, {static: false }) public labelComponent;

    /**
     * Field is empty?
     */
    private get fieldIsEmpty() {
        return !this.value;
    }

    private height = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private backend: backend ,
        private elRef: ElementRef,
        private changeDetRef: ChangeDetectorRef,
        private modalservice: modal,
        private sanitizer: DomSanitizer
    ) {
        super( model, view, language, metadata, router );
    }

    public ngAfterViewInit() {
        // Calculate the height of the field:
        if ( this.fieldconfig.height ) this.height = 'calc(' + this.fieldconfig.height + ' - 2px - 0.5rem )';
    }

    /**
     * The URL for the image tag.
     */
    public get imageUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl( 'data:' + this.value );
    }

    /**
     * CSS style for the component.
     */
    private get style() {
        return { height: this.height };
    }

    /**
     * Delete the existing image.
     */
    private deleteImage(): void {
        this.value = '';
    }

    /**
     * Import an image or edit the existing image.
     */
    private editImage( droppedFiles: FileList = null ): void {
        this.modalservice.openModal('SystemImageModal').subscribe( modalRef => {

            if ( this.field_defs.maxWidth ) modalRef.instance.maxWidth = this.field_defs.maxWidth;
            if ( this.field_defs.maxHeight ) modalRef.instance.maxHeight = this.field_defs.maxHeight;

            let modalTitle = this.labelComponent.label; // As window title use the label from the field.
            if ( !modalTitle ) modalTitle = this.language.getLabel('LBL_IMAGE'); // use lbl_image when no label available
            modalRef.instance.title = modalTitle;

            if ( this.value ) modalRef.instance.imageData = this.value;

            modalRef.instance.answer.subscribe( imageData => {
                if ( imageData !== false ) this.value = imageData;
            });

            if ( droppedFiles ) modalRef.instance.droppedFiles = droppedFiles;

        });
    }

    /**
     * The Handler when a file has been dropped.
     * @param dropEvent
     */
    private onDrop( droppedFiles ): void {
        this.view.setEditMode();
        this.editImage( droppedFiles );
    }

}
