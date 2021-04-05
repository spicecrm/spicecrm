/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import {Component, ViewChild, ViewContainerRef, EventEmitter, Input, Output, Renderer2, OnDestroy} from "@angular/core";
import {DomSanitizer} from '@angular/platform-browser';
import {language} from "../../services/language.service";
import {libloader} from "../../services/libloader.service";

/**
 * @ignore
 */
declare var Croppie: any;

/**
 * a generic modal component that renders a cnavas with an uipload button,. The user can select an image and then resize and crop it
 */
@Component({
    selector: "system-upload-image",
    templateUrl: "./src/systemcomponents/templates/systemuploadimage.html"
})
export class SystemUploadImage implements OnDestroy {
    /**
     * a reference to the image container
     */
    @ViewChild("imgupload", {read: ViewContainerRef, static: false}) public imgupload: ViewContainerRef;

    /**
     * the height of a crop area in pixel
     */
    @Input() public cropheight: number = 200;

    /**
     * the with of the crop area in pixel
     */
    @Input() public cropwidth: number = 200;

    /**
     * the shape of the crop area
     */
    @Input() public croptype: 'square' | 'circle' = 'circle';

    /**
     * set to true to allow the user to resize the crop area
     */
    @Input() public cropresize: boolean = false;

    /**
     * an event emitter with the image data of the resulting crop image
     */
    @Output() public imagedata: EventEmitter<any> = new EventEmitter<any>();

    /**
     * a reference to the modal itsel
     */
    private self: any;

    /**
     * @ignore
     *
     * the base64 string of the image
     */
    private imageBase64: any;

    /**
     * @ignore
     *
     * the croppie image when the croppie has been loaded andis initialized
     */
    private croppie: any;

    /**
     * allow pasting an image. This is the listener that catches the past event on the window
     */
    private pasteListener: any;

    constructor(private language: language, private libloader: libloader, private renderer: Renderer2, private sanitizer: DomSanitizer) {
        this.pasteListener = this.renderer.listen('window', 'paste', e => {
            e.preventDefault();
            e.stopPropagation();
            let blob = e.clipboardData.items[0].getAsFile();
            let URLObj = window.URL;
            this.imageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(URLObj.createObjectURL(blob));
        });
    }

    public ngOnDestroy(): void {
        this.pasteListener();
    }

    /**
     * @ignore
     *
     * a getter for the style of the croppie component
     */
    get croppiestyle() {
        return {
            height: (this.cropheight * 2) + 'px'
        };
    }

    /**
     * closes the modal
     *
     * @param emitfalse set to false to not emit an image if one is set
     */
    private close(emitfalse = true) {
        if (emitfalse) this.imagedata.emit(false);
        this.self.destroy();
    }

    /**
     * trigger the upload image window and prompt the user to select an image
     */
    private showUpload() {
        let event = new MouseEvent("click", {bubbles: true});
        this.imgupload.element.nativeElement.dispatchEvent(event);
    }

    /**
     * uploading the filw using the HTML5 FileReader
     *
     * @param event the event object when the file has been selected or has been pasted
     */
    private uploadImage(event) {
        let reader = new FileReader();
        reader.onloadend = (e) => {
            this.imageBase64 = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    /**
     * execute the crop on the image on the canvas. This is triggered when the image has been loaded
     *
     * @param event the event itself
     */
    private doCrop(event): void {
        if (!this.croppie) {
            this.libloader.loadLib('croppie').subscribe(
                (next) => {
                    this.croppie = new Croppie(document.getElementById('croppieimage'), {
                        enableExif: true,
                        enableOrientation: true,
                        enableZoom: true,
                        enforceBoundary: true,
                        mouseWheelZoom: true,
                        showZoomer: true,
                        enableResize: this.cropresize,
                        viewport: {
                            width: this.cropwidth,
                            height: this.cropheight,
                            type: 'circle'
                        },
                        boundary: {
                            height: this.cropheight * 2
                        }
                    });
                }
            );
        }
    }

    /**
     * gets the cropped image as sized and positioned by the user in the modal. This emits the imagedata and closes the image
     */
    private getcroppedImage(): void {
        this.croppie.result({
            type: 'base64',
            size: 'viewport'
        }).then(resp => {
            this.imagedata.emit(resp);
            this.close(false);
        });
    }
}
