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
    ViewChild,
    AfterViewInit,
    Renderer2
} from '@angular/core';
import { model } from '../../../services/model.service';
import { view } from '../../../services/view.service';
import { Router } from '@angular/router';
import { language } from '../../../services/language.service';
import { metadata } from '../../../services/metadata.service';
import { fieldGeneric } from '../../../objectfields/components/fieldgeneric';
import { mediafiles } from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';
import { modal } from '../../../services/modal.service';

@Component( {
    selector: 'field-media-file',
    templateUrl: './src/modules/mediafiles/templates/fieldmediafile.html',
    providers: [ mediafiles ],
})
export class fieldMediaFile extends fieldGeneric implements OnInit, AfterViewInit {

    private currentViewMode: string;
    private imageUrlVariant: string;
    private imageUrlOriginal: string;
    private isLoadingVariant = false;
    private isLoadingOriginal = false;
    private widthOfImgFrame: number;
    private heightOfImgFrame: number;

    private allowR: string;

    @ViewChild('imgFrame', {static: false}) private imgFrame: ElementRef;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private mediafiles: mediafiles,
        private backend: backend ,
        private elRef: ElementRef,
        private modalservice: modal
    ) {
        super( model, view, language, metadata, router );
    }

    public ngAfterViewInit() {
        this.widthOfImgFrame = this.getWidthOfImgFrame();
        this.heightOfImgFrame = this.getHeightOfImgFrame();
        this.view.mode$.subscribe( mode => {
            if ( this.currentViewMode !== mode ) {
                if( mode === 'view' ) {
                    this.loadImageVariant();
                }
                if( mode === 'edit' ) {
                    this.loadImageOriginal();
                }
                this.currentViewMode = mode;
            }
        });
    }

    private loadImageVariant(): void {
        this.imageUrlVariant = '';
        if ( this.model.isNew ) return;
        this.isLoadingVariant = true;
        this.mediafiles.getImageVariant( this.model.id, 'mwh/' + this.widthOfImgFrame + '/' + this.heightOfImgFrame ).subscribe( url => {
            this.imageUrlVariant = url;
            this.isLoadingVariant = false;
        });
    }

    private loadImageOriginal(): void {
        this.imageUrlOriginal = '';
        if ( this.model.isNew ) return;
        this.isLoadingOriginal = true;
        this.mediafiles.getImage( this.model.id ).subscribe( url => {
            this.imageUrlOriginal = url;
            this.isLoadingOriginal = false;
        },
            error => {
            this.isLoadingOriginal = false;
            });
    }

    private getWidthOfImgFrame(): number {
        if ( !this.imgFrame ) return 0;
        return Math.ceil( Number( getComputedStyle( this.imgFrame.nativeElement, null ).width.replace( /px$/, '' )));
    }

    private getHeightOfImgFrame(): number {
        if ( !this.imgFrame ) return 0;
        return Math.ceil( Number( getComputedStyle( this.imgFrame.nativeElement, null ).height.replace( /px$/, '' )));
    }

    private openLightbox() {
        this.modalservice.openModal('SystemImagePreviewModal', true ).subscribe( modal => {
            modal.instance.imgname = this.model.getField('name');
            modal.instance.imgtype = this.model.getField('filetype');
            this.mediafiles.getImage( this.model.data.id ).subscribe( url => {
                modal.instance.imgsrc = url;
            });
        });
    }

    private mediaChange( data ): void {
        if ( data.isDirty ) {
            // console.log( 'mediaChange, dirty' );
            this.model.setField( this.fieldname, data.image );
            this.fileformat = data.metaData.fileformat;
            if( data.isImported && this.fieldconfig.copyFilenameToFieldName && data.metaData.filename && !this.model.getField( this.fieldForName ) ) {
                this.model.setField( this.fieldForName, data.metaData.filename.replace( /\.[^\.]+$/, '' ).replace( /_/, ' ' ) );
            }
        } else {
            // console.log( 'mediaChange, not dirty' );
        }
    }

    get fieldForFileformat() {
        return this.fieldconfig.fieldForFileformat ? this.fieldconfig.fieldForFileformat : 'filetype';
    }

    get fieldForName() {
        return this.fieldconfig.fieldForName ? this.fieldconfig.fieldForName : 'name';
    }

    private set fileformat( value ) {
        this.model.setField( this.fieldForFileformat, value );
    }
    private get fileformat(): number {
        return this.model.getField( this.fieldForFileformat );
    }

}
