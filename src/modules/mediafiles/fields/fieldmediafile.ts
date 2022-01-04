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
    templateUrl: '../templates/fieldmediafile.html',
    providers: [ mediafiles ],
})
export class fieldMediaFile extends fieldGeneric implements OnInit, AfterViewInit {

    public currentViewMode: string;
    public imageUrlVariant: string;
    public imageUrlOriginal: string;
    public isLoadingVariant = false;
    public isLoadingOriginal = false;
    public widthOfImgFrame: number;
    public heightOfImgFrame: number;

    public allowR: string;

    @ViewChild('imgFrame', {static: false}) public imgFrame: ElementRef;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public mediafiles: mediafiles,
        public backend: backend ,
        public elRef: ElementRef,
        public modalservice: modal
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

    public loadImageVariant(): void {
        this.imageUrlVariant = '';
        if ( this.model.isNew ) return;
        this.isLoadingVariant = true;
        this.mediafiles.getImageVariant( this.model.id, 'mwh/' + this.widthOfImgFrame + '/' + this.heightOfImgFrame ).subscribe( url => {
            this.imageUrlVariant = url;
            this.isLoadingVariant = false;
        });
    }

    public loadImageOriginal(): void {
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

    public getWidthOfImgFrame(): number {
        if ( !this.imgFrame ) return 0;
        return Math.ceil( Number( getComputedStyle( this.imgFrame.nativeElement, null ).width.replace( /px$/, '' )));
    }

    public getHeightOfImgFrame(): number {
        if ( !this.imgFrame ) return 0;
        return Math.ceil( Number( getComputedStyle( this.imgFrame.nativeElement, null ).height.replace( /px$/, '' )));
    }

    public openLightbox() {
        this.modalservice.openModal('SystemImagePreviewModal', true ).subscribe( modal => {
            modal.instance.imgname = this.model.getField('name');
            modal.instance.imgtype = this.model.getField('filetype');
            this.mediafiles.getImage( this.model.id ).subscribe( url => {
                modal.instance.imgsrc = url;
            });
        });
    }

    public mediaChange( data ): void {
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

    public set fileformat( value ) {
        this.model.setField( this.fieldForFileformat, value );
    }
    public get fileformat(): number {
        return this.model.getField( this.fieldForFileformat );
    }

}
