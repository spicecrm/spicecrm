/**
 * @module SystemComponents
 */
import { Component, ViewChild, EventEmitter, Input, Output, OnDestroy, ElementRef, AfterViewChecked, Renderer2, ChangeDetectorRef } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { language } from "../../services/language.service";
import { metadata } from "../../services/metadata.service";
import { toast } from '../../services/toast.service';
import { modelutilities } from '../../services/modelutilities.service';
import { userpreferences } from '../../services/userpreferences.service';
import { HttpClient } from '@angular/common/http';

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
    isModified: boolean;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}

@Component({
    selector: "system-input-media",
    templateUrl: "./src/systemcomponents/templates/systeminputmedia.html",
    styles: [
        'div.chessbg { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC") }',
        ':host { display: block; position: relative; }'
    ]
})
export class SystemInputMedia implements OnDestroy, AfterViewChecked {

    @ViewChild('fileselector') private fileSelector: ElementRef;
    @ViewChild('imgelement') private imageElement: ElementRef;

    @ViewChild('area_metadata1') private areaMetadata1: ElementRef;
    @ViewChild('area_metadata2') private areaMetadata2: ElementRef;
    @ViewChild('area_media') private areaMedia: ElementRef;
    @ViewChild('area_controls') private areaControls: ElementRef;

    @Output() public mediaReady: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * @ignore
     *
     * the base64 string of the image
     */
    private mediaBase64: SafeResourceUrl = '';

    private cropper: any = null;

    private isDragOver = false;
    private filetypeErrorMessageCode: string = null;
    private fileFromBrowser: File = null;

    private maxWidthInput = '';
    private maxHeightInput = '';
    private maxWidth: number = null;
    private maxHeight: number = null;

    private isCropped = false;

    // image qualities analoge to backend
    private imageQualities = { bmp: true, gif: null, jpg: 85, jpeg: 85, png: 9, webp: 80 }; // for png: it´s not the quality, it´s the compression (lossless)

    private mediaTypes = { image: 1, audio: 2, video: 3 };

    public mediaMetaData: mediaMetaData;

    @Input() private allowCropping = false;
    @Input() private allowResizing = false;
    @Input() public acceptMedia: any = null;

    private doResize = false;

    private componentInstanceId: string;

    private areaMediaHeight = '0px';

    private proxyurl = 'proxy/?useurl=';

    private isLoading = false;

    private imageIsToBeEncoded = false;

    /**
     * allow pasting an image. This is the listener that catches the past event on the window
     */
    private unlistenPasteEvent: any;

    constructor(
        private lang: language,
        private metadata: metadata,
        private sanitizer: DomSanitizer,
        private toast: toast,
        private utils: modelutilities,
        public userprefs: userpreferences,
        private componentElRef: ElementRef,
        private renderer: Renderer2,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) {

        this.resetMediaMetaData();

        this.componentInstanceId = this.utils.generateGuid();

        this.unlistenPasteEvent = this.renderer.listen('window', 'paste', ( e: ClipboardEvent ) => {

            e.preventDefault();
            e.stopPropagation();

            if ( this.isLoading ) return;

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
                                this.imageIsToBeEncoded = false;
                                this.mediaMetaData.fileformat = type.toString();
                                this.mediaMetaData.filename = url.substring( url.lastIndexOf('/')+1 );
                                this.mediaMetaData.mimetype = data.body.type;
                                this._imageLoaded();
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
                    this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl( window.URL.createObjectURL( blob ) );
                    this.imageIsToBeEncoded = true;
                    this._imageLoaded();

                }

            }
        });

    }

    private resetMediaMetaData() {
        this.mediaMetaData = {
            mediatype: 1,
            mimetype: null,
            fileformat: null,
            filename: null,
            isModified: false,
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
        this.areaMediaHeight = this.componentElRef.nativeElement.offsetHeight - this.areaControls.nativeElement.offsetHeight - this.areaMetadata1.nativeElement.offsetHeight - this.areaMetadata2.nativeElement.offsetHeight - 20 + 'px';
        this.cd.detectChanges(); // prevents angular change detection error
    }

    public ngAfterViewChecked(): void {
        this.setSizeOfAreaMedia();
    }

    private get isResized(): boolean {
        return this.mediaMetaData.width !== this.mediaMetaData.originalWidth || this.mediaMetaData.height !== this.mediaMetaData.originalHeight;
    }

    /**
     * trigger the upload image window and prompt the user to select an image
     */
    private triggerFileSelectionDialog(): void {
        this.fileSelector.nativeElement.dispatchEvent( new MouseEvent('click', { bubbles: true }) );
    }

    /**
     *
     *
     * @param event the event object when the file has been selected or has been pasted
     */
    private getMediaFromFileSystem(): void {
        let reader = new FileReader();
        reader.onloadend = e => {
            this.mediaBase64 = reader.result;
            this._imageLoaded();
        };
        reader.readAsDataURL( this.fileFromBrowser );
        // document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(document.querySelector("#file-input").files[0]));
    }

    private _imageLoaded(): void {
        this.mediaReady.emit(this.mediaBase64.toString().length > 0 );
    }

    /**
     *
     *
     * @param event the event itself
     */
    private imageLoaded( event ): void {
        let image = this.imageElement.nativeElement;
        this.metadata.loadLibs('cropper').subscribe(
            (next) => {
                if ( this.cropper ) this.cropper.destroy();
                const cropperOptions = {
                    autoCrop: false,
                    viewMode: 2 // 2
                };
                image.addEventListener('ready', () => {
                    this.mediaMetaData.width = this.mediaMetaData.originalWidth = this.cropper.getImageData().naturalWidth;
                    this.mediaMetaData.height = this.mediaMetaData.originalHeight = this.cropper.getImageData().naturalHeight;
                    this.calcTargetSize();
                });
                this.cropper = new Cropper( image, cropperOptions );
                if ( this.allowCropping ) {
                    this.imageElement.nativeElement.addEventListener('cropend', event => {
                        this.calcTargetSize();
                        this.isCropped = true;
                    });
                }
                this.imageElement.nativeElement.addEventListener('zoom', event => { this.calcTargetSize(); });
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
            // Use DataTransfer interface to access the file
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
            this.showFiletypeError( this.getFileextension( this.fileFromBrowser ));
            this.fileFromBrowser = null;
            return;
        }
        this.resetMediaMetaData();
        this.imageIsToBeEncoded = false;
        this.mediaMetaData.fileformat = type;
        this.mediaMetaData.filename = this.fileFromBrowser.name;
        this.mediaMetaData.mimetype = this.fileFromBrowser.type;
        this.getMediaFromFileSystem();
    }

    private getFileextension( file: File ): string {
        return file.name.split('.').pop();
    }

    private removeImage(): void {
        this.resetMediaMetaData();
        this.cropper.destroy();
        this.mediaBase64 = null;
    }

    public getImage(): SafeResourceUrl {
        if ( !this.cropper ) return false;
        let image;
        if ( this.cropper.getCropBoxData().hasOwnProperty('left') ) image = this.cropper.getCroppedCanvas().toDataURL(); // 'image/jpeg', 0.8
        else image = this.mediaBase64.toString();
        return image.substring( image.indexOf('base64,') + 7 );
    }

    public getMetaData(): mediaMetaData {
        return this.mediaMetaData;
    }

    private removeCropping(): void {
        this.cropper.clear();
        this.isCropped = false;
        this.calcTargetSize();
    }

    private resetSize(): void {
        this.mediaMetaData.width = this.mediaMetaData.originalWidth;
        this.mediaMetaData.height = this.mediaMetaData.originalHeight;
    }

    private get canCrop(): boolean {
        return this.allowCropping;
    }

    private get canResize(): boolean {
        return this.allowResizing;
    }

    private get width(): number {
        return this.cropper.getData(true).width;
    }

    private get height(): number {
        return this.cropper.getData(true).height;
    }

    private maxHeightChanged(): void {
        let val: number|string = this.maxHeightInput;
        val = val.split( this.userprefs.toUse.num_grp_sep ).join('');
        val = parseInt( val, 10 );
        if ( isNaN( val ) || val <= 0 ) {
            this.maxHeightInput = '';
            this.maxHeight = null;
        } else {
            this.maxHeightInput = val.toString();
            this.maxHeight = val;
        }
        this.calcTargetSize();
    }

    private maxWidthChanged(): void {
        let val: number|string = this.maxWidthInput;
        val = val.split( this.userprefs.toUse.num_grp_sep ).join('');
        val = parseInt( val, 10 );
        if ( isNaN( val ) || val <= 0 ) {
            this.maxWidthInput = '';
            this.maxWidth = null;
        } else {
            this.maxWidthInput = val.toString();
            this.maxWidth = val;
        }
        this.calcTargetSize();
    }

    private calcTargetSize(): void {
        let ratio = 1;
        let height;
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
        console.log('this.mediaMetaData',this.mediaMetaData);
    }

    public ngOnDestroy(): void {
        if ( this.filetypeErrorMessageCode ) this.toast.clearToast( this.filetypeErrorMessageCode );
        this.unlistenPasteEvent();
    }

}
