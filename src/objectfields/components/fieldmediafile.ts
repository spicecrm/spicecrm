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
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { Router } from '@angular/router';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { fieldGeneric } from './fieldgeneric';
import { mediafiles } from '../../services/mediafiles.service';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';

@Component( {
    selector: 'field-media-file',
    templateUrl: './src/objectfields/templates/fieldmediafile.html',
    providers: [ mediafiles ],
})
export class fieldMediaFile extends fieldGeneric implements OnInit, AfterViewInit {

    private currentViewMode: string;
    private imageUrlVariant: string;
    private imageUrlOriginal: string;
    private isLoadingVariant = true;
    private isLoadingOriginal = true;
    private widthOfImgFrame: number;
    private heightOfImgFrame: number;

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
        this.isLoadingVariant = true;
        this.mediafiles.getImageVariant( this.model.id, 'mwh/' + this.widthOfImgFrame + '/' + this.heightOfImgFrame ).subscribe( url => {
            this.imageUrlVariant = url;
            this.isLoadingVariant = false;
        });
    }

    private loadImageOriginal(): void {
        this.imageUrlOriginal = '';
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
        return Math.ceil( Number( getComputedStyle( this.imgFrame.nativeElement, null ).width.replace( /px$/, '' )));
    }

    private getHeightOfImgFrame(): number {
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
            console.log( 'mediaChange, dirty' );
            this.model.setField( this.fieldname, data.image );
            this.mediatype = data.metaData.mediatype;
            this.fileformat = data.metaData.fileformat;
            if( data.isImported && this.fieldconfig.copyFilenameToFieldName && data.metaData.filename && !this.model.getField( this.fieldForName ) ) {
                this.model.setField( this.fieldForName, data.metaData.filename.replace( /\.[^\.]+$/, '' ).replace( /_/, ' ' ) );
            }
        } else {
            console.log( 'mediaChange, not dirty' );
        }
    }

    get fieldForMediatype() {
        return this.fieldconfig.fieldForMediatype ? this.fieldconfig.fieldForMediatype : 'mediatype';
    }

    get fieldForFileformat() {
        return this.fieldconfig.fieldForFileformat ? this.fieldconfig.fieldForFileformat : 'filetype';
    }

    get fieldForName() {
        return this.fieldconfig.fieldForName ? this.fieldconfig.fieldForName : 'name';
    }

    private set mediatype( value ) {
        this.model.setField( this.fieldForMediatype, value );
    }
    private get mediatype(): number {
        return this.model.getField( this.fieldForMediatype );
    }

    private set fileformat( value ) {
        this.model.setField( this.fieldForFileformat, value );
    }
    private get fileformat(): number {
        return this.model.getField( this.fieldForFileformat );
    }

}
