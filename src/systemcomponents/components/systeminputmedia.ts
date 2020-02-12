/**
 * @module SystemComponents
 */
import {
    Component,
    ViewChild,
    EventEmitter,
    Input,
    Output,
    OnDestroy,
    ElementRef,
    AfterViewChecked,
    Renderer2,
    ChangeDetectorRef, OnChanges, forwardRef
} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {toast} from '../../services/toast.service';
import {userpreferences} from '../../services/userpreferences.service';
import {HttpClient} from '@angular/common/http';
import {libloader} from '../../services/libloader.service';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var Cropper: any;

declare var _: any;

interface mediaMetaData {
    mediatype: number;
    mimetype: string;
    fileformat: string;
    filename: string;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}

interface mediaData {
    metaData: {
        mediatype: number;
        fileformat: string;
    };
    image: SafeResourceUrl;
    isDirty: boolean;
    isImported: boolean;
}

@Component({
    selector: "system-input-media",
    templateUrl: "./src/systemcomponents/templates/systeminputmedia.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputMedia),
            multi: true
        }
    ]
})
export class SystemInputMedia implements OnDestroy {

    /**
     * for the value accessor
     */
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * the height of the complete component in px
     */
    @Input() private componentHeight: any = '500';

    // It is important to keep the input variable "allowModifications" at first position, before the other allowXY variables.
    @Input()
    private set allowModifications(val: boolean) {
        this.allowMirroring = this.allowResizing = this.allowRotating = this.allowCropping = val;
    }

    @Input() private allowCropping = true;
    @Input() private allowResizing = true;
    @Input() private allowRotating = true;
    @Input() private allowMirroring = true;

    @Input() private fileformat: string;
    @Input() private mediatype: number;

    // @Output() public mediaChange: EventEmitter<mediaData> = new EventEmitter<mediaData>();

    @ViewChild('fileselector', {static: false}) private fileSelector: ElementRef;
    @ViewChild('imgelement', {static: false}) private imageElement: ElementRef;

    /**
     * the reference to the bottom toolbar
     */
    @ViewChild('bottomtoolbar', {static: false}) private bottomtoolbar: ElementRef;

    /**
     * the reference to the  toolbar
     */
    @ViewChild('toolbar', {static: false}) private toolbar: ElementRef;

    /**
     * the base64 encoded string of the image
     */
    private mediaBase64: SafeResourceUrl = null;

    /**
     * regference to the cropper that is instanciated
     */
    private cropper: any = null;

    private filetypeErrorMessageCode: string = null;
    private fileFromBrowser: File = null;

    private maxWidthInput = '';
    private maxHeightInput = '';
    private maxWidth: number = null;
    private maxHeight: number = null;

    private isCropped = false;
    private isImported = false;

    // image qualities analog to backend
    // private imageQualities = { bmp: true, gif: null, jpg: 85, jpeg: 85, png: 9, webp: 80 }; // for png: it´s not the quality, it´s the compression (lossless)

    private MEDIATYPE_IMAGE = 1;
    // private MEDIATYPE_AUDIO = 2;
    // private MEDIATYPE_VIDEO = 3;

    public mediaMetaData: mediaMetaData;

    private _doResize = false;

    private componentId: string;

    private isLoading = false;

    /**
     * allow pasting an image. This is the listener that catches the past event on the window
     */
    private unlistenPasteEvent: any;

    private xMirrored = 1;
    private yMirrored = 1;
    private currentRotation = 0;

    private jpegCompressionLevel = 0.95;

    private lastCropBoxData = {};

    constructor(
        private language: language,
        private metadata: metadata,
        private sanitizer: DomSanitizer,
        private toast: toast,
        private userprefs: userpreferences,
        private componentElRef: ElementRef,
        private renderer: Renderer2,
        private http: HttpClient,
        private cd: ChangeDetectorRef,
        private libloader: libloader
    ) {

        this.resetMediaMetaData();

        this.componentId = _.uniqueId();

        this.unlistenPasteEvent = this.renderer.listen('window', 'paste', (e: ClipboardEvent) => {
            this.handlePaste(e);
        });

    }

    /**
     * handles the past event
     * @param e
     */
    private handlePaste(e) {

        e.preventDefault();
        e.stopPropagation();

        if (this.isLoading) return;

        if (e.clipboardData.files && e.clipboardData.files[0]) {
            this.fileFromBrowser = e.clipboardData.files[0];
            this.fileSelectedOrDropped();
        }

        if (e.clipboardData.items && e.clipboardData.items[0]) {
            const pastedItem = e.clipboardData.items[0];

            // handling if an url is pasted
            if (pastedItem.kind === 'string') {

                pastedItem.getAsString((url: string) => {
                    if (this.stringLooksLikeUrl(url)) {
                        this.resetFiletypeError();
                        this.isLoading = true;
                        this.cd.detectChanges();
                        this.http.get('proxy/?useurl=' + btoa(url), {
                            observe: 'response',
                            responseType: 'blob'
                        }).subscribe(data => {
                            this.isLoading = false;
                            this.cd.detectChanges();
                            this.fileFromBrowser = null;
                            const type = this.getFiletypeFromMimetype(data.body.type);
                            if (type === false || !this.checkFiletype(type)) { // We only accept a file with these image extensions
                                this.showFiletypeError(type);
                                return;
                            }
                            this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(data.body));
                            this.cd.detectChanges();
                            this.resetMediaMetaData();
                            this.resetModificationStati();
                            this.isImported = true;
                            this.mediaMetaData.fileformat = type.toString();
                            this.mediaMetaData.filename = url.substring(url.lastIndexOf('/') + 1);
                            this.mediaMetaData.mimetype = data.body.type;
                        }, err => {
                            this.isLoading = false;
                        });
                    }
                });

            } else {

                this.resetFiletypeError();
                const blob = pastedItem.getAsFile();
                const type = this.getFiletypeFromMimetype(blob);
                if (type === false || !this.checkFiletype(type)) { // We only accept a file with these image extensions
                    this.showFiletypeError(type);
                    return;
                }
                this.mediaMetaData.fileformat = type.toString();
                this.mediaMetaData.mimetype = blob.type;
                this.resetModificationStati();
                this.isImported = true;
                this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

            }

        }
    }

    /*
    public ngOnChanges(): void {
        if (this.mediaBase64 !== null) {
            this.mediaMetaData.fileformat = this.fileformat;
            this.mediaMetaData.mediatype = this.mediatype;
            this.resetModificationStati();
            this.isImported = false;
        }
    }
    */

    private resetMediaMetaData() {
        this.mediaMetaData = {
            mediatype: this.MEDIATYPE_IMAGE,
            mimetype: null,
            fileformat: null,
            filename: null,
            width: 0,
            height: 0,
            originalWidth: 0,
            originalHeight: 0
        };
    }

    private stringLooksLikeUrl(string): boolean {
        return /^(http|https|ftp|file):\/\//.test(string);
    }

    /**
     * calöcuilates the height for the cropper part and returns it for the ngStyle on the element
     */
    get cropperHeight() {
        try {
            return this.componentHeight - this.toolbar.nativeElement.offsetHeight - this.bottomtoolbar.nativeElement.offsetHeight - 5 + 'px';
        } catch (e) {
            return '0px';
        }
    }

    /**
     * trigger the upload image window and prompt the user to select an image
     */
    private triggerFileSelectionDialog(): void {
        this.fileSelector.nativeElement.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    }

    private getMediaFromFileSystem(): void {
        let reader = new FileReader();
        reader.onloadend = e => {
            this.resetModificationStati();
            this.isImported = true;
            this.mediaBase64 = reader.result;
        };
        // reader.onerror = e => { };
        reader.readAsDataURL(this.fileFromBrowser);
    }

    private imageLoaded(event): void {

        let image = this.imageElement.nativeElement;

        image.addEventListener('ready', () => {
            if (this.cropper) {
                this.mediaMetaData.originalWidth = this.cropper.getImageData().naturalWidth;
                this.mediaMetaData.originalHeight = this.cropper.getImageData().naturalHeight;
                this.calcTargetSize();
                if (this.isDirty) this.emitChange();
                // this.cropper.zoomTo(1);
            }
        });

        if (this.allowCropping) {
            image.addEventListener('cropend', () => {
                let cropBoxData = this.cropper.getCropBoxData();
                this.isCropped = !_.isEmpty(this.cropper.getCropBoxData());
                if (_.isEqual(cropBoxData, this.lastCropBoxData)) return;
                this.lastCropBoxData = _.clone(cropBoxData);
                this.emitChange();
                this.calcTargetSize();
            });
        }

        image.addEventListener('zoom', () => {
            if (this.isEdited) this.emitChange();
            if (this.isCropped) this.calcTargetSize();
        });

        this.libloader.loadLib('cropper').subscribe(
            (next) => {
                if (this.cropper) this.cropper.destroy();
                this.cropper = new Cropper(image, {
                    autoCrop: false,
                    viewMode: 1,
                    toggleDragModeOnDblclick: this.allowCropping,
                    dragMode: this.allowCropping ? 'crop' : 'move'
                });
                this.cropper.crop();
            }
        );

    }

    private onDrop(event): void {
        this.fileFromBrowser = event[0];
        this.fileSelectedOrDropped();

    }

    private getFiletypeFromMimetype(fileOrMimetype: File | string): boolean | string {
        const filetype = typeof fileOrMimetype === 'object' ? fileOrMimetype.type : fileOrMimetype;
        if (!/^image\/\w+/.test(filetype)) return false;
        return filetype.split('/').pop();
    }

    private checkFiletype(type): boolean {
        return type === 'jpeg' || type === 'png' || type === 'gif';
    }

    private showFiletypeError(type: string | boolean): void {
        if (this.filetypeErrorMessageCode) this.toast.clearToast(this.filetypeErrorMessageCode);
        this.filetypeErrorMessageCode = this.toast.sendToast('Not an image file or file type ' + (type ? '"' + type + '"' : '') + ' not supported.', 'error', null, false, this.filetypeErrorMessageCode);
    }

    private resetFiletypeError() {
        if (this.filetypeErrorMessageCode) this.toast.clearToast(this.filetypeErrorMessageCode);
    }

    private fileSelectionChange(): boolean {
        if (this.fileSelector.nativeElement.files.length === 1) {
            this.fileFromBrowser = this.fileSelector.nativeElement.files[0];
            this.fileSelectedOrDropped();
        }
        this.fileSelector.nativeElement.value = null;
        return false;
    }

    private fileSelectedOrDropped(): void {
        this.resetFiletypeError();
        const type = this.getFiletypeFromMimetype(this.fileFromBrowser);
        if (type === false || (type !== 'jpeg' && type !== 'png' && type !== 'gif')) { // We only accept a file with these image extensions
            this.showFiletypeError(this.getFileExtension(this.fileFromBrowser));
            this.fileFromBrowser = null;
            return;
        }
        this.resetMediaMetaData();
        this.mediaMetaData.fileformat = type;
        this.mediaMetaData.filename = this.fileFromBrowser.name;
        this.mediaMetaData.mimetype = this.fileFromBrowser.type;
        this.getMediaFromFileSystem();
    }

    private getFileExtension(file: File): string {
        return file.name.split('.').pop();
    }

    /**
     * removes the image, resets the base64 string and destroys the cropper instance
     */
    private removeImage(): void {
        this.resetMediaMetaData();

        // if we have A CROPPER DESTROY IT AND SET TO UNDEFINED
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = undefined;
        }

        // reset the image data and emit the change
        this.mediaBase64 = null;
        this.emitChange();
    }

    /**
     * The parent component want the image (rotated, mirrored, cropped, resized, ...)
     */
    public getImage(): SafeResourceUrl {

        // no cropper no image return null
        if (!this.cropper) return null;

        // otherwise extract the aimge
        let image;
        if (this.isEdited || this.isResized) {
            image = this.cropper.getCroppedCanvas({
                maxHeight: this.mediaMetaData.height,
                maxWidth: this.mediaMetaData.width,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            }) // height: this.mediaMetaData.height, width:this.mediaMetaData.width,
                .toDataURL('image/' + this.mediaMetaData.fileformat, this.mediaMetaData.fileformat === 'jpeg' ? this.jpegCompressionLevel : undefined);
        } else image = this.mediaBase64.toString();
        return image; // .substring(image.indexOf('base64,') + 7);
    }

    /**
     * sets the cropper to move mode
     */
    private setMoveMode() {
        this.cropper.setDragMode('move');
    }

    /**
     * sets the cropper to crop mode
     */
    private setCropMode() {
        this.cropper.setDragMode('crop');
    }

    /**
     * removes a cropper if one is set
     */
    private removeCropping(): void {
        this.cropper.clear();
        this.isCropped = false;
        this.lastCropBoxData = {};
        this.calcTargetSize();
        this.emitChange();
    }

    private resetSize(): void {
        this.mediaMetaData.width = this.mediaMetaData.originalWidth;
        this.mediaMetaData.height = this.mediaMetaData.originalHeight;
    }

    /**
     * rturns true if image can be cropped
     */
    private get canCrop(): boolean {
        return this.allowCropping;
    }

    private get canResize(): boolean {
        return this.allowResizing && this.cropper;
    }

    private get canMirror(): boolean {
        return this.allowMirroring && this.cropper;
    }

    private get canRotate(): boolean {
        return this.allowRotating && this.cropper;
    }

    private get width(): number {
        return this.cropper.getData(true).width;
    }

    private get height(): number {
        return this.cropper.getData(true).height;
    }

    // ...
    private maxHeightChanged(): void {
        let val: number;
        val = parseInt(this.maxHeightInput, 10);
        this.maxHeight = isNaN(val) ? null : val;
        this.calcTargetSize();
        this.emitChange();
    }

    // ...
    private maxWidthChanged(): void {
        let val: number;
        val = parseInt(this.maxWidthInput, 10);
        this.maxWidth = isNaN(val) ? null : val;
        this.calcTargetSize();
        this.emitChange();
    }

    /**
     * gets the internal value for the resize checkbox
     */
    get doResize() {
        return this._doResize;
    }

    /**
     * sets the internal value for the resize checkbox and recalculates the target size
     * @param value
     */
    set doResize(value) {
        this._doResize = value;
        this.calcTargetSize();
    }

    // Calculate target size. Is to be written to object "mediaMetaData".
    private calcTargetSize(): void {
        let ratio = 1, height;
        let width = this.cropper.getData(true).width;
        if (width === 0) {
            width = this.cropper.getImageData().naturalWidth;
            height = this.cropper.getImageData().naturalHeight;
        } else height = this.cropper.getData(true).height;
        if (this.doResize && (this.maxWidth && width > this.maxWidth || this.maxHeight && height > this.maxHeight)) {
            if (this.maxWidth && !this.maxHeight) ratio = this.maxWidth / width;
            else if (this.maxHeight && !this.maxWidth) ratio = this.maxHeight / height;
            else ratio = this.maxWidth / width < this.maxHeight / height ? this.maxWidth / width : this.maxHeight / height;
            this.mediaMetaData.width = Math.floor(width * ratio);
            this.mediaMetaData.height = Math.floor(height * ratio);
        } else {
            this.mediaMetaData.width = width;
            this.mediaMetaData.height = height;
        }
    }

    public ngOnDestroy(): void {
        if (this.filetypeErrorMessageCode) this.toast.clearToast(this.filetypeErrorMessageCode); // In case there is a open toast.
        this.unlistenPasteEvent(); // Don´t leave event listening.
    }

    /**
     * zoom into the image
     */
    private zoomin() {
        this.cropper.zoom(0.1);
    }

    /**
     * zoom out of the image
     */
    private zoomout() {
        this.cropper.zoom(-0.1);
    }

    public mirrorX(): void {
        // if ... else: Workaround for strange behavior of cropper.js in case the image lies sideways (90 or 270 degrees)
        if (this.currentRotation === 90 || this.currentRotation === 270) this.cropper.scaleY(this.yMirrored = this.yMirrored * -1);
        else this.cropper.scaleX(this.xMirrored = this.xMirrored * -1);
        this.emitChange();
    }

    public mirrorY(): void {
        // if ... else: Workaround for strange behavior of cropper.js in case the image lies sideways (90 or 270 degrees)
        if (this.currentRotation === 90 || this.currentRotation === 270) this.cropper.scaleX(this.xMirrored = this.xMirrored * -1);
        else this.cropper.scaleY(this.yMirrored = this.yMirrored * -1);
        this.emitChange();
    }

    public rotate(degrees): void {
        this.currentRotation += degrees;
        this.currentRotation = this.currentRotation % 360;
        if (this.currentRotation < 0) this.currentRotation += 360;
        this.cropper.rotateTo(this.currentRotation);
        this.emitChange();
    }

    private get isRotated(): boolean {
        return this.currentRotation !== 0;
    }

    private get isMirrored(): boolean {
        return this.xMirrored === -1 || this.yMirrored === -1;
    }

    private get isResized(): boolean {
        return this.mediaMetaData.width !== this.mediaMetaData.originalWidth || this.mediaMetaData.height !== this.mediaMetaData.originalHeight;
    }

    private get isEdited(): boolean {
        return this.isRotated || this.isMirrored || this.isCropped;
    }

    private get isDirty(): boolean {
        return this.isEdited || this.isImported || this.isResized;
    }

    private emitChange() {
        let im = this.getImage();
        this.onChange(im.toString());

        /*
        this.mediaChange.emit({
            metaData: this.mediaMetaData,
            image: this.isDirty ? im : null,
            isDirty: this.isDirty,
            isImported: this.isImported
        });
        */
    }

    private resetModificationStati(): void {
        this.xMirrored = this.yMirrored = 1;
        this.currentRotation = 0;
        this.isCropped = false;
        this.lastCropBoxData = {};
    }

    private removeModifications(): void {
        this.cropper.rotateTo(0);
        this.cropper.scale(1, 1); // this.cropper.scale( this.xMirrored === -1 ? -1:1, this.yMirrored === -1 ? -1:1 );
        this.cropper.clear();
        this.isCropped = false;
        this.lastCropBoxData = {};
        this.calcTargetSize();
        this.emitChange();
    }

    private get allowEditing(): boolean {
        return this.allowCropping || this.allowRotating || this.allowMirroring;
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value
     */
    public writeValue(value: any): void {
        if (value && value != '') {
            this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(value);
        }
        // toDo check if thsi is still needed
        if (this.mediaBase64 !== null) {
            this.mediaMetaData.fileformat = this.fileformat;
            this.mediaMetaData.mediatype = this.mediatype;
            this.resetModificationStati();
            this.isImported = false;
        }
    }

}
