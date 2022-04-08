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
    templateUrl: '../templates/fieldimage.html',
})
export class fieldImage extends fieldGeneric implements OnInit, AfterViewInit {

    /**
     * loads the input component
     */
    @ViewChild(fieldLabel, {static: false }) public labelComponent;

    /**
     * Field is empty?
     */
    public get fieldIsEmpty() {
        return !this.value;
    }

    public height = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public backend: backend ,
        public elRef: ElementRef,
        public changeDetRef: ChangeDetectorRef,
        public modalservice: modal,
        public sanitizer: DomSanitizer
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
    public get style() {
        return { height: this.height };
    }

    /**
     * Delete the existing image.
     */
    public deleteImage(): void {
        this.value = '';
    }

    /**
     * Import an image or edit the existing image.
     */
    public editImage( droppedFiles: FileList = null ): void {
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
    public onDrop( droppedFiles ): void {
        this.view.setEditMode();
        this.editImage( droppedFiles );
    }

}
