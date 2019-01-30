import {Component, ViewChild, ViewContainerRef, EventEmitter, Input, Output} from "@angular/core";
import {language} from "../../services/language.service";


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
    @Output() public imagedata: EventEmitter<any> = new EventEmitter<any>();

    private self: any;
    private imageBase64: any;
    private croppie: any;

    constructor(private language: language) {

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
            this.croppie = new Croppie(document.getElementById('croppieimage'), {
                enableExif: true,
                enableOrientation: true,
                enableZoom: true,
                enforceBoundary: true,
                mouseWheelZoom: true,
                showZoomer: true,
                enableResize: false,
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
