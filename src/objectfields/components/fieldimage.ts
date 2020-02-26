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

@Component( {
    selector: 'field-simple-image',
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
        console.log(this.model.fields);
    }

    /**
     * The URL for the image tag.
     */
    public get imageUrl(): SafeResourceUrl {
        let positionOfDelimiter = this.value.indexOf( '|' );
        let fileformat = this.value.substring( 0, positionOfDelimiter );
        return this.sanitizer.bypassSecurityTrustResourceUrl( 'data:image/' + fileformat + ';base64,' + this.value.substring( positionOfDelimiter + 1 ) );
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
    private editImage(): void {
        this.modalservice.openModal('SystemImageModal').subscribe( modalRef => {

            if ( this.field_defs.maxWidth ) modalRef.instance.maxWidth = this.field_defs.maxHeight;
            if ( this.field_defs.maxHeight ) modalRef.instance.maxHeight = this.field_defs.maxHeight;

            let modalTitle = this.labelComponent.label; // As window title use the label from the field.
            if ( !modalTitle ) modalTitle = this.language.getLabel('LBL_IMAGE'); // use lbl_image when no label available
            modalRef.instance.title = modalTitle;

            modalRef.instance.imageData = this.value;

            modalRef.instance.answer.subscribe( imageData => {
                if ( imageData !== false ) {
                    this.value = imageData;
                }
            });
        });
    }

}
