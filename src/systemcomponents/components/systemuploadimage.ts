import {Component, ViewChild, ViewContainerRef, EventEmitter, Input, Output, Renderer2} from "@angular/core";
import {DomSanitizer} from '@angular/platform-browser';
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";


declare var Croppie: any;

@Component({
    selector: "system-upload-image",
    templateUrl: "./src/systemcomponents/templates/systemuploadimage.html"
})
export class SystemUploadImage {
    @ViewChild("imgupload", {read: ViewContainerRef}) public imgupload: ViewContainerRef;

    @Input() public cropheight: number = 200;
    @Input() public cropwidth: number = 200;
    @Input() public croptype: 'square' | 'circle' = 'circle';
    @Input() public cropresize: boolean = false;
    @Output() public imagedata: EventEmitter<any> = new EventEmitter<any>();

    private self: any;
    private imageBase64: any;
    private croppie: any;
    private pasteListener: any;

    constructor(private language: language, private metadata: metadata, private renderer: Renderer2, private sanitizer: DomSanitizer) {
        this.pasteListener = this.renderer.listen('window', 'paste', e => {
            e.preventDefault();
            e.stopPropagation();
            let blob = e.clipboardData.items[0].getAsFile();
            let URLObj = window.URL;
            this.imageBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(URLObj.createObjectURL(blob));
        });
    }

    get croppiestyle() {
        return {
            height: (this.cropheight * 2) + 'px'
        };
    }

    private close(emitfalse = true) {
        if (emitfalse) this.imagedata.emit(false);
        this.self.destroy();
    }

    private showUpload() {
        let event = new MouseEvent("click", {bubbles: true});
        this.imgupload.element.nativeElement.dispatchEvent(event);
    }

    private uploadImage(event) {
        let reader = new FileReader();
        reader.onloadend = (e) => {
            this.imageBase64 = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    private doCrop(event) {
        if (!this.croppie) {
            this.metadata.loadLibs('croppie').subscribe(
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

    private getcroppedImage() {
        this.croppie.result({
            type: 'base64',
            size: 'viewport'
        }).then(resp => {
            this.imagedata.emit(resp);
            this.close(false);
        });
    }
}
