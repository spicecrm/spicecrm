import { Component, ElementRef, OnInit, Input, ViewContainerRef, Renderer, ViewChild, AfterViewInit, ChangeDetectorRef  } from '@angular/core';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { Router } from '@angular/router';
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { fieldGeneric } from './fieldgeneric';
import { mediafiles } from '../../services/mediafiles.service';
import { backend } from '../../services/backend.service';
import {toast} from "../../services/toast.service";

@Component( {
    selector: 'field-media-file-image',
    templateUrl: './src/objectfields/templates/fieldmediafileimage.html',
    providers: [ mediafiles ],
    styles: [
        'div.field-media-file-image-popover { position: absolute; width: 160px; height: 160px; left: calc(50% - 80px); top: calc(50% - 80px); z-index: 1; background-color: #ccc; border-radius: 0.25rem; background-color: #fdfdfd; box-shadow: 0 2px 3px 0 rgba(0,0,0,.16); border: 1px solid #d8dde6 }',
        'div.field-media-file-image-popover img { border: 1px solid #999; }',
        'div.left div.field-media-file-image-popover { left: calc(100% - 160px); }',
        'div.bottom div.field-media-file-image-popover { top: 0; }',

        'button.close { position: absolute; top: 0.25rem; right: 0.25rem; cursor: pointer; margin: 0; }',
        'button.close svg { filter: drop-shadow( 0px 0px 3px #fff) }',
        'div.format-button button.delete { position: absolute; bottom: 0.25rem; left: 0.25rem; margin: 0; }',
        'button.toLightbox { position: absolute; bottom: 0.25rem; right: 0.25rem; margin: 0; }',

        'div.formatButton { display: inline-block; }',
        'div.format-image img { max-height:100%; display:block; margin:auto;padding:.25rem;top:0;bottom:0;left:0;right:0; }',
        'div.format-image button.delete { position: absolute; bottom:0.25rem; right:0.25rem; margin:0; }',
        'button.withThumb { width: 4rem; }',
        'input { background-color: #54698d; }',
        'div.format-button img.imgInButton { border-radius: 0.25rem 0 0 0.25rem; padding: 1px 0 1px 1px; height: calc(2rem - 2px); width: calc(2rem - 1px); }'
    ]
})
export class fieldMediaFileImage extends fieldGeneric implements OnInit, AfterViewInit {

    //@Input() size: number = 30;

    thumbSize: number;

    relateIdField: string = '';
    relateNameField: string = '';
    relateType: string = '';

    clickListener: any;

    imageUrl: string;
    imageUrlEnlarged: string;

    enlarged = false;
    lightboxOpen = false;

    fieldIsEmpty: boolean = true;

    lastValue: string = '';

    height: string = '';

    @ViewChild('buttonToEnlargement') buttonToEnlargement: ElementRef;
    @ViewChild('buttonToPicker') buttonToPicker: ElementRef;

    size1rem: number;
    widthOfParent: number;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        private toast:toast,
        public router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private mediafiles: mediafiles,
        private backend: backend ,
        private elRef:ElementRef,
        private changeDetRef: ChangeDetectorRef
    ) {
        super( model, view, language, metadata, router );
    }

    ngOnInit() {
        if ( this.fieldconfig.format !== 'image' ) this.fieldconfig.format = 'button';
    }

    ngAfterViewInit() {

        this.size1rem = this.getSize1rem();
        this.thumbSize = this.size1rem * 2 - 2;
        this.widthOfParent = this.getWidthOfParent();

        if ( this.fieldconfig['height'] )
            this.height = 'calc('+this.fieldconfig['height']+' - 2px - 0.5rem )';

        if (this.model.isLoading)
            this.model.data$.subscribe( () => { this.afterLoadingModel(); } );
        else
            this.afterLoadingModel();

    }

    afterLoadingModel() {
        this.lastValue = this.model.data[this.fieldname];
        this.loadImages();
        this.model.data$.subscribe( () => {
            if ( this.model.data[this.fieldname] !== this.lastValue ) {
                this.lastValue = this.model.data[this.fieldname];
                this.loadImages();
            }
        });
    }

    public onClick( event: MouseEvent ): void {
        if ( !this.elementRef.nativeElement.contains( event.target ) ) // clicked inside?
            this.enlarged= false;
    }

    private closePopups() {
        this.clickListener();
        this.enlarged = false;
    }

    openEnlarged() {
        this.clickListener = this.renderer.listen( 'document', 'click', ( event ) => this.onClick( event ) );
        this.enlarged = true;
    }
    closeEnlarged() {
        this.enlarged = false;
        if ( this.buttonToEnlargement ) this.buttonToEnlargement.nativeElement.focus();
    }

    loadImages() {
        if ( this.model.data[this.fieldname] ) {
            this.fieldIsEmpty = false;
            if ( this.fieldconfig.format === 'button' ) {
                this.mediafiles.getImageVariant( this.model.data[this.fieldname], 'th/' + this.thumbSize ).subscribe( url => {
                    this.imageUrl = url;
                } );
                this.mediafiles.getImageVariant( this.model.data[this.fieldname], 'th/200' ).subscribe( url => {
                    this.imageUrlEnlarged = url;
                } );
            } else { // format === 'image'
                this.mediafiles.getImageVariant( this.model.data[this.fieldname], 'mw/' + this.determineWidthOfImage() ).subscribe( url => {
                    this.imageUrl = url;
                });
            }
        } else this.fieldIsEmpty = true;
    }

    openLightbox() {
        this.enlarged = false;
        alert('Lightbox (große Anzeige des Bildes) ist noch nicht implementiert.');
    }
    closeLightbox() {}

    clearField4button() {
        this.imageUrl = this.imageUrlEnlarged = this.value = '';
        this.enlarged = false;
        if ( this.buttonToPicker ) this.buttonToPicker.nativeElement.focus();
        this.fieldIsEmpty = true;
    }

    clearField4image() {
        this.imageUrl = this.model.data[this.fieldname] = '';
        this.fieldIsEmpty = true;
    }

    getImage() {
        this.mediafiles.getMediaFile( 1, '', this.fieldconfig.noImagePicker || false, this.fieldconfig.noMetaData || false, this.fieldconfig.category ).subscribe( (answer) => {
            if ( answer ) {
                this.value = answer;
                this.loadImages();
            }
        });
    }

    getSize1rem() {
        return Math.ceil( Number( getComputedStyle( document.documentElement,null ).fontSize.replace( /px$/, '' )));
    }

    getWidthOfParent() {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement.parentElement, null ).width.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement.parentElement, null ).paddingLeft.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement.parentElement, null ).paddingRight.replace( /px$/, '' ));
    }

    determineWidthOfImage() {
        return Math.round( this.widthOfParent );
    }

    get imageStyle(){
        return {
            height: this.height
        }
    }

}