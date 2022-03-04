/**
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, OnDestroy, Output, Renderer2, ViewChild, ViewContainerRef} from "@angular/core";
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
    templateUrl: "../templates/systemuploadimage.html"
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
    public self: any;

    /**
     * @ignore
     *
     * the base64 string of the image
     */
    public imageBase64: any;

    /**
     * @ignore
     *
     * the croppie image when the croppie has been loaded andis initialized
     */
    public croppie: any;

    /**
     * allow pasting an image. This is the listener that catches the past event on the window
     */
    public pasteListener: any;

    constructor(public language: language, public libloader: libloader, public renderer: Renderer2, public sanitizer: DomSanitizer) {
        this.pasteListener = this.renderer.listen('window', 'paste', e => {
            e.preventDefault();
            e.stopPropagation();
            let blob = e.clipboardData.items[0].getAsFile();
            let URLObj = window.URL;
            this.imageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(URLObj.createObjectURL(blob));
        });
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

    public ngOnDestroy(): void {
        this.pasteListener();
    }

    /**
     * closes the modal
     *
     * @param emitfalse set to false to not emit an image if one is set
     */
    public close(emitfalse = true) {
        if (emitfalse) this.imagedata.emit(false);
        this.self.destroy();
    }

    /**
     * trigger the upload image window and prompt the user to select an image
     */
    public showUpload() {
        let event = new MouseEvent("click", {bubbles: true});
        this.imgupload.element.nativeElement.dispatchEvent(event);
    }

    /**
     * uploading the filw using the HTML5 FileReader
     *
     * @param event the event object when the file has been selected or has been pasted
     */
    public uploadImage(event) {
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
    public doCrop(event): void {
        if (!this.croppie) {
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
    }

    /**
     * gets the cropped image as sized and positioned by the user in the modal. This emits the imagedata and closes the image
     */
    public getcroppedImage(): void {
        this.croppie.result({
            type: 'base64',
            size: 'viewport'
        }).then(resp => {
            this.imagedata.emit(resp);
            this.close(false);
        });
    }
}
