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
    ChangeDetectorRef, OnChanges
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { language } from "../../services/language.service";
import { metadata } from "../../services/metadata.service";
import { toast } from '../../services/toast.service';
import { userpreferences } from '../../services/userpreferences.service';
import { HttpClient } from '@angular/common/http';
import { libloader } from '../../services/libloader.service';

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
    styles: [
        'div.chessbg { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC") }',
        ':host { display: block; position: relative; }'
    ]
})
export class SystemInputMedia implements OnChanges, OnDestroy, AfterViewChecked {

    // It is important to keep the input variable "allowModifications" at first position, before the other allowXY variables.
    @Input() private set allowModifications( val: boolean ) {
        this.allowMirroring = this.allowResizing = this.allowRotating = this.allowCropping = val;
    }
    @Input() private allowCropping = true;
    @Input() private allowResizing = true;
    @Input() private allowRotating = true;
    @Input() private allowMirroring = true;

    @Input() public acceptMedia = { image: true, video: false, audio: false };
    @Input() private fileformat: string;
    @Input() private mediatype: number;

    @Output() public mediaChange: EventEmitter<mediaData> = new EventEmitter<mediaData>();

    @ViewChild('fileselector', { static: false }) private fileSelector: ElementRef;
    @ViewChild('imgelement', { static: false }) private imageElement: ElementRef;

    @ViewChild('area_metadata', { static: false }) private areaMetadata: ElementRef;
    @ViewChild('area_media', { static: false }) private areaMedia: ElementRef;
    @ViewChild('area_controls', { static: false }) private areaControls: ElementRef;

    @Input('image') private mediaBase64: SafeResourceUrl = null;

    private cropper: any = null;

    private isDragOver = false;
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

    private doResize = false;

    private componentId: string;

    private areaMediaHeight = '0px';

    private proxyurl = 'proxy/?useurl=';

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
        private lang: language,
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

        this.unlistenPasteEvent = this.renderer.listen('window', 'paste', ( e: ClipboardEvent ) => {

            e.preventDefault();
            e.stopPropagation();

            if ( this.isLoading ) return;

            if ( e.clipboardData.files && e.clipboardData.files[0] ) {
                this.fileFromBrowser = e.clipboardData.files[0];
                this.fileSelectedOrDropped();
            }

            if ( e.clipboardData.items && e.clipboardData.items[0] ) {
                const pastedItem = e.clipboardData.items[0];

                if ( pastedItem.kind === 'string' ) {

                    pastedItem.getAsString( ( url: string ) => {
                        if ( this.stringLooksLikeUrl( url )) {
                            this.resetFiletypeError();
                            this.isLoading = true;
                            this.cd.detectChanges();
                            this.http.get( this.proxyurl + btoa( url ), {
                                observe: 'response',
                                responseType: 'blob'
                            } ).subscribe( data => {
                                this.isLoading = false;
                                this.cd.detectChanges();
                                this.fileFromBrowser = null;
                                const type = this.getFiletypeFromMimetype( data.body.type );
                                if ( type === false || !this.checkFiletype( type )) { // We only accept a file with these image extensions
                                    this.showFiletypeError( type );
                                    return;
                                }
                                this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl( window.URL.createObjectURL( data.body ));
                                this.cd.detectChanges();
                                this.resetMediaMetaData();
                                this.resetModificationStati();
                                this.isImported = true;
                                this.mediaMetaData.fileformat = type.toString();
                                this.mediaMetaData.filename = url.substring( url.lastIndexOf('/')+1 );
                                this.mediaMetaData.mimetype = data.body.type;
                            }, err => {
                                this.isLoading = false;
                            });
                        }
                    });

                } else {

                    this.resetFiletypeError();
                    const blob = pastedItem.getAsFile();
                    const type = this.getFiletypeFromMimetype( blob );
                    if ( type === false || !this.checkFiletype( type )) { // We only accept a file with these image extensions
                        this.showFiletypeError( type );
                        return;
                    }
                    this.mediaMetaData.fileformat = type.toString();
                    this.mediaMetaData.mimetype = blob.type;
                    this.resetModificationStati();
                    this.isImported = true;
                    this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl( window.URL.createObjectURL( blob ) );

                }

            }
        });

    }

    public ngOnChanges(): void {
        if ( this.mediaBase64 !== null ) {
            this.mediaMetaData.fileformat = this.fileformat;
            this.mediaMetaData.mediatype = this.mediatype;
            this.resetModificationStati();
            this.isImported = false;
        }
    }

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

    private stringLooksLikeUrl( string ): boolean {
        return /^(http|https|ftp|file):\/\//.test( string );
    }

    private setSizeOfAreaMedia(): void {
        this.areaMediaHeight = this.componentElRef.nativeElement.offsetHeight - this.areaControls.nativeElement.offsetHeight - this.areaMetadata.nativeElement.offsetHeight - 5 + 'px';
        this.cd.detectChanges(); // prevents angular change detection error
    }

    public ngAfterViewChecked(): void {
        this.setSizeOfAreaMedia();
    }

    /**
     * trigger the upload image window and prompt the user to select an image
     */
    private triggerFileSelectionDialog(): void {
        this.fileSelector.nativeElement.dispatchEvent( new MouseEvent('click', { bubbles: true }) );
    }

    private getMediaFromFileSystem(): void {
        let reader = new FileReader();
        reader.onloadend = e => {
            this.resetModificationStati();
            this.isImported = true;
            this.mediaBase64 = reader.result;
        };
        // reader.onerror = e => { };
        reader.readAsDataURL( this.fileFromBrowser );
    }

    private imageLoaded( event ): void {

        let image = this.imageElement.nativeElement;

        image.addEventListener('ready', () => {
            if ( this.cropper ) {
                this.mediaMetaData.originalWidth = this.cropper.getImageData().naturalWidth;
                this.mediaMetaData.originalHeight = this.cropper.getImageData().naturalHeight;
                this.calcTargetSize();
                if ( this.isDirty ) this.emitChange();
                this.cropper.zoomTo(1);
            }
        });

        if ( this.allowCropping ) {
            image.addEventListener('cropend', () => {
                let cropBoxData = this.cropper.getCropBoxData();
                this.isCropped = !_.isEmpty( this.cropper.getCropBoxData() );
                if ( _.isEqual( cropBoxData, this.lastCropBoxData )) return;
                this.lastCropBoxData = _.clone( cropBoxData );
                this.emitChange();
                this.calcTargetSize();
            });
        }

        image.addEventListener('zoom', () => {
            if ( this.isEdited ) this.emitChange();
            if ( this.isCropped ) this.calcTargetSize();
        });

        this.libloader.loadLib('cropper').subscribe(
            (next) => {
                if ( this.cropper ) this.cropper.destroy();
                this.cropper = new Cropper( image, { autoCrop: false, viewMode: 2, toggleDragModeOnDblclick: this.allowCropping, dragMode: this.allowCropping ? 'crop':'move' });
            }
        );

    }

    private onDrop( event: DragEvent ): void {
        event.preventDefault(); // Turn off the browser's default drag and drop handler.
        this.isDragOver = false;
        if ( event.dataTransfer.items.length ) {
            // Use DataTransferItemList interface to access the file
            _.values( event.dataTransfer.items ).some( item => {
                if ( item.kind === 'file') {
                    this.fileFromBrowser = item.getAsFile();
                    this.fileSelectedOrDropped();
                    return true;
                }
            });
        } else {
            // Use DataTransfer Interface to access the file
            if ( event.dataTransfer.files ) this.fileFromBrowser = event.dataTransfer.files[0];
            this.fileSelectedOrDropped();
        }
    }

    private getFiletypeFromMimetype( fileOrMimetype: File|string ): boolean|string {
        const filetype = typeof fileOrMimetype === 'object' ? fileOrMimetype.type : fileOrMimetype;
        if( !/^image\/\w+/.test( filetype ) ) return false;
        return filetype.split('/').pop();
    }

    private checkFiletype( type ): boolean {
        return type === 'jpeg' || type === 'png' || type === 'gif';
    }

    private showFiletypeError( type: string|boolean ): void {
        if ( this.filetypeErrorMessageCode ) this.toast.clearToast( this.filetypeErrorMessageCode );
        this.filetypeErrorMessageCode = this.toast.sendToast('Not an image file or file type ' + ( type ? '"'+type+'"':'' ) + ' not supported.','error', null, false, this.filetypeErrorMessageCode );
    }

    private resetFiletypeError() {
        if ( this.filetypeErrorMessageCode ) this.toast.clearToast( this.filetypeErrorMessageCode );
    }

    private onDragOver( event: DragEvent ): void {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        this.isDragOver = true;
    }

    private onDragLeave(): void {
        this.isDragOver = false;
    }

    private fileSelectionChange(): boolean {
        if ( this.fileSelector.nativeElement.files.length === 1 ) {
            this.fileFromBrowser = this.fileSelector.nativeElement.files[0];
            this.fileSelectedOrDropped();
        }
        this.fileSelector.nativeElement.value = null;
        return false;
    }

    private fileSelectedOrDropped(): void {
        this.resetFiletypeError();
        const type = this.getFiletypeFromMimetype( this.fileFromBrowser );
        if ( type === false || ( type !== 'jpeg' && type !== 'png' && type !== 'gif' )) { // We only accept a file with these image extensions
            this.showFiletypeError( this.getFileExtension( this.fileFromBrowser ));
            this.fileFromBrowser = null;
            return;
        }
        this.resetMediaMetaData();
        this.mediaMetaData.fileformat = type;
        this.mediaMetaData.filename = this.fileFromBrowser.name;
        this.mediaMetaData.mimetype = this.fileFromBrowser.type;
        this.getMediaFromFileSystem();
    }

    private getFileExtension( file: File ): string {
        return file.name.split('.').pop();
    }

    private removeImage(): void {
        this.resetMediaMetaData();
        this.cropper.destroy();
        this.mediaBase64 = null;
    }

    // The parent component want the image (rotated, mirrored, cropped, resized, ...)
    public getImage(): SafeResourceUrl {
        if ( !this.cropper ) return false;
        let image;
        if ( this.isEdited || this.isResized ) {
            image = this.cropper.getCroppedCanvas({ maxHeight: this.mediaMetaData.height, maxWidth:this.mediaMetaData.width, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' }) // height: this.mediaMetaData.height, width:this.mediaMetaData.width,
                .toDataURL('image/' + this.mediaMetaData.fileformat, this.mediaMetaData.fileformat === 'jpeg' ? this.jpegCompressionLevel : undefined );
        } else image = this.mediaBase64.toString();
        return image.substring( image.indexOf('base64,') + 7 );
    }

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
        val = parseInt( this.maxHeightInput, 10 );
        this.maxHeight = isNaN( val ) ? null : val;
        this.calcTargetSize();
        this.emitChange();
    }

    // ...
    private maxWidthChanged(): void {
        let val: number;
        val = parseInt( this.maxWidthInput, 10 );
        this.maxWidth = isNaN( val ) ? null : val;
        this.calcTargetSize();
        this.emitChange();
    }

    // Calculate target size. Is to be written to object "mediaMetaData".
    private calcTargetSize(): void {
        let ratio = 1, height;
        let width = this.cropper.getData(true).width;
        if ( width === 0 ) {
            width = this.cropper.getImageData().naturalWidth;
            height = this.cropper.getImageData().naturalHeight;
        } else height = this.cropper.getData(true).height;
        if ( this.doResize && ( this.maxWidth && width > this.maxWidth || this.maxHeight && height > this.maxHeight ) ) {
            if ( this.maxWidth && !this.maxHeight ) ratio = this.maxWidth / width;
            else if ( this.maxHeight && !this.maxWidth ) ratio = this.maxHeight / height;
            else ratio = this.maxWidth / width < this.maxHeight / height ? this.maxWidth / width : this.maxHeight / height;
            this.mediaMetaData.width = Math.floor( width * ratio );
            this.mediaMetaData.height = Math.floor( height * ratio );
        } else {
            this.mediaMetaData.width = width;
            this.mediaMetaData.height = height;
        }
    }

    public ngOnDestroy(): void {
        if ( this.filetypeErrorMessageCode ) this.toast.clearToast( this.filetypeErrorMessageCode ); // In case there is a open toast.
        this.unlistenPasteEvent(); // Don´t leave event listening.
    }

    public mirrorX(): void {
        // if ... else: Workaround for strange behavior of cropper.js in case the image lies sideways (90 or 270 degrees)
        if ( this.currentRotation === 90 || this.currentRotation === 270 ) this.cropper.scaleY( this.yMirrored = this.yMirrored * -1 );
        else this.cropper.scaleX( this.xMirrored = this.xMirrored * -1 );
        this.emitChange();
    }

    public mirrorY(): void {
        // if ... else: Workaround for strange behavior of cropper.js in case the image lies sideways (90 or 270 degrees)
        if ( this.currentRotation === 90 || this.currentRotation === 270 ) this.cropper.scaleX( this.xMirrored = this.xMirrored * -1 );
        else this.cropper.scaleY( this.yMirrored = this.yMirrored * -1 );
        this.emitChange();
    }

    public rotate( degrees ): void {
        this.currentRotation += degrees;
        this.currentRotation = this.currentRotation % 360;
        if ( this.currentRotation < 0 ) this.currentRotation += 360;
        this.cropper.rotateTo( this.currentRotation );
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
        this.mediaChange.emit( {
            metaData: this.mediaMetaData,
            image: this.isDirty ? im : null,
            isDirty: this.isDirty,
            isImported: this.isImported
        });
    }

    private resetModificationStati(): void {
        this.xMirrored = this.yMirrored = 1;
        this.currentRotation = 0;
        this.isCropped = false;
        this.lastCropBoxData = {};
    }

    private removeModifications(): void {
        this.cropper.rotateTo( 0 );
        this.cropper.scale( 1, 1 ); // this.cropper.scale( this.xMirrored === -1 ? -1:1, this.yMirrored === -1 ? -1:1 );
        this.cropper.clear();
        this.isCropped = false;
        this.lastCropBoxData = {};
        this.calcTargetSize();
        this.emitChange();
    }

    private get allowEditing(): boolean {
        return this.allowCropping || this.allowRotating || this.allowMirroring;
    }

}
