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
    templateUrl: '../templates/fieldsignature.html'
})
export class FieldSignatureComponent extends fieldGeneric implements AfterViewInit {
    @ViewChild('canvas', {static: true}) public canvas: ElementRef;
    public pad: any;

    public display_name_field: string;
    public signature_height: number = 200;
    public signature_width: number = 400;

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

    public undo() {
        let data = this.pad.toData();
        if (data) {
            data.pop(); // remove the last dot or line
            this.pad.fromData(data);
            this.convert();
        }
    }

    public clear() {
        this.pad.clear();
        this.convert();
    }

    public convert() {
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
