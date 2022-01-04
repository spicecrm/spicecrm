/**
 * @module ObjectFields
 */
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    AfterViewInit,
    Renderer2, OnDestroy
} from '@angular/core';
import { model } from '../../../services/model.service';
import { view } from '../../../services/view.service';
import { Router } from '@angular/router';
import { language } from '../../../services/language.service';
import { metadata } from '../../../services/metadata.service';
import { fieldGeneric } from '../../../objectfields/components/fieldgeneric';
import { mediafiles } from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';

@Component( {
    selector: 'field-media-file-image',
    templateUrl: '../templates/fieldmediafileimage.html',
    providers: [ mediafiles ],
})
export class fieldMediaFileImage extends fieldGeneric implements OnInit, AfterViewInit, OnDestroy {

    /**
     * Pixel size of the thumbnail.
     */
    public thumbSize: number;

    /**
     * Holz function for unsubscribing from click listener.
     */
    public unsubscribeClickListener: any;

    /**
     * The base64 encoded url of the image.
     */
    public imageUrl: string;

    /**
     * The base64 encoded url of the enlarged image.
     */
    public imageUrlEnlarged: string;

    /**
     * Is the image currently enlarged? (PopOver)
     */
    public enlarged = false;

    /**
     * Is the field empty?
     */
    public fieldIsEmpty = true;

    /**
     * Holds the last value of the field, to detect change.
     */
    public lastValue = '';

    /**
     * Pixel height of the field.
     */
    public height = '';

    @ViewChild('buttonToEnlargement', {static: true}) public buttonToEnlargement: ElementRef;
    @ViewChild('buttonToPicker', {static: true}) public buttonToPicker: ElementRef;

    /**
     * The pixel size of 1 rem.
     */
    public size1rem: number;

    /**
     * The pixel width of the parent element.
     */
    public widthOfParent: number;

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
        public elRef: ElementRef
    ) {
        super( model, view, language, metadata, router );
    }

    public ngOnInit(): void {
        if ( this.fieldconfig.format !== 'image' ) this.fieldconfig.format = 'button';
    }

    public ngAfterViewInit() {
        this.size1rem = this.getSize1rem();
        this.thumbSize = this.size1rem * 2 - 2;
        this.widthOfParent = this.getWidthOfParent();

        if ( this.fieldconfig.height ) this.height = 'calc(' + this.fieldconfig.height + ' - 2px - 0.5rem )';

        this.model.data$.subscribe( () => { this.afterLoadingModel(); } );
    }

    /**
     * Stuff to do, when the model has been loaded.
     */
    public afterLoadingModel(): void {
        this.lastValue = this.model.getField(this.fieldname);
        this.loadImages();
        this.model.data$.subscribe( () => {
            if ( this.model.getField(this.fieldname) !== this.lastValue ) {
                this.lastValue = this.model.getField(this.fieldname);
                this.loadImages();
            }
        });
    }

    /**
     * Handler for a mouse click.
     * @param event Mouse Event
     */
    public onClick( event: MouseEvent ): void {
        // clicked inside?
        if ( !this.elementRef.nativeElement.contains( event.target )) this.enlarged= false;
    }

    /**
     * Show enlarged variant of the image.
     */
    public openEnlarged(): void {
        this.unsubscribeClickListener = this.renderer.listen( 'document', 'click', ( event ) => this.onClick( event ) );
        this.enlarged = true;
    }

    /**
     * Close enlarged variant of the image.
     */
    public closeEnlarged(): void {
        this.enlarged = false;
        if ( this.buttonToEnlargement ) this.buttonToEnlargement.nativeElement.focus();
        this.unsubscribeClickListener();
    }

    /**
     * Load the image/thumbnails from the backend with the proper size.
     */
    public loadImages(): void {
        if ( this.model.getField(this.fieldname) ) {
            this.fieldIsEmpty = false;
            if ( this.fieldconfig.format === 'button' ) {
                this.mediafiles.getImageVariant( this.model.getField(this.fieldname), 'th/' + this.thumbSize ).subscribe( url => {
                    this.imageUrl = url;
                } );
                this.mediafiles.getImageVariant( this.model.getField(this.fieldname), 'th/200' ).subscribe( url => {
                    this.imageUrlEnlarged = url;
                } );
            } else { // format === 'image'
                this.mediafiles.getImageVariant( this.model.getField(this.fieldname), 'mw/' + this.determineWidthOfImage() ).subscribe( url => {
                    this.imageUrl = url;
                });
            }
        } else this.fieldIsEmpty = true;
    }

    /**
     * Removes the image in case it is a button image.
     */
    public clearField4button(): void {
        this.imageUrl = this.imageUrlEnlarged = this.value = '';
        this.enlarged = false;
        if ( this.buttonToPicker ) this.buttonToPicker.nativeElement.focus();
        this.fieldIsEmpty = true;
    }

    /**
     * Removes the image in case it is a real image (not a button image).
     */
    public clearField4image(): void {
        this.imageUrl = '';
        this.model.setField(this.fieldname, '');
        this.fieldIsEmpty = true;
    }

    /**
     * Get the image from the user.
     */
    public getImage(): void {

        this.mediafiles.getMediaFile( this.fieldconfig.noImagePicker || false, this.fieldconfig.noMetaData || false, this.fieldconfig.category ).subscribe( (answer) => {
            if ( answer ) {
                this.value = answer;
                this.loadImages();
            }
        });
    }

    /**
     * Edit the existing image. ToDo!
     */
    public editImage(): void {
        1;
    }

    /**
     * Determine the pixel size of 1 rem.
     */
    public getSize1rem(): number {
        return Math.ceil( Number( getComputedStyle( document.documentElement,null ).fontSize.replace( /px$/, '' )));
    }

    /**
     * Determine the pixel width of the parent element (less any padding).
     */
    public getWidthOfParent(): number {
        return Number( getComputedStyle( this.elRef.nativeElement.parentElement.parentElement, null ).width.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement.parentElement, null ).paddingLeft.replace( /px$/, '' ))
            - Number( getComputedStyle( this.elRef.nativeElement.parentElement.parentElement, null ).paddingRight.replace( /px$/, '' ));
    }

    /**
     * Determine the maximal pixel width of the image, using the width of the parent element.
     */
    public determineWidthOfImage(): number {
        return Math.round( this.widthOfParent );
    }

    public get imageStyle() {
        return { height: this.height };
    }

    /**
     * Set model and view to edit mode.
     */
    public setEditMode() {
        if ( this.isEditable() ) {
            this.model.startEdit();
            this.view.setEditMode( this.fieldid );
        }
    }

    /**
     * Is the field editable?
     */
    public isEditable(): boolean {
        return this.getStati( this.fieldname ).editable && !this.getStati( this.fieldname ).readonly && !this.getStati( this.fieldname ).disabled && !this.getStati( this.fieldname ).hidden;
    }

    public ngOnDestroy() {
        if ( this.unsubscribeClickListener ) this.unsubscribeClickListener();
        super.ngOnDestroy();
    }

}
