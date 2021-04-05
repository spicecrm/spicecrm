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
import {
    Component,
    ViewChild,
    Input,
    OnDestroy,
    ElementRef,
    Renderer2,
    ChangeDetectorRef,
    forwardRef, EventEmitter, Output
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

/**
 * @ignore
 */
declare var _: any;

/**
 * The meta data of the image.
 */
interface mediaMetaData {
    mimetype: string;
    fileformat: string;
    filename: string;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
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
    private onChange: (value: any) => void;
    private onTouched: () => void;

    /**
     * the height of the complete component in px
     */
    @Input() private componentHeight = 500;

    /**
     * Should image modifications (mirroring, resizing, rotating, cropping, ...) be allowed? Default is true.
     * It is important to keep the input variable "allowModifications" at first position, before the other allowXY variables.
     * @param val
     */
    @Input()
    private set allowModifications(val: boolean) {
        this.allowMirroring = this.allowResizing = this.allowRotating = this.allowCropping = val;
    }

    /**
     * Should cropping be allowed?
     */
    @Input() private allowCropping = true;

    /**
     * Should resizing be allowed?
     */
    @Input() private allowResizing = true;

    /**
     * Should rotating be allowed?
     */
    @Input() private allowRotating = true;

    /**
     * Should mirroring be allowed?
     */
    @Input() private allowMirroring = true;

    /**
     * The mime type (image/jpg, image/png, ...) of the image file when provided from outside.
     */
    @Input('mimetype') public set _mimetype( value: string ) {
        this.mediaMetaData.mimetype = value;
        this.mediaMetaData.fileformat = this.getFileformatFromMimetype( this.mediaMetaData.mimetype ) as string;
    }

    @Output('mimetype') public mimetype = new EventEmitter<string>();
    /**
     * The reference to the file input field.
     */
    @ViewChild('fileselector', {static: false}) private fileSelector: ElementRef;

    /**
     * The reference to the image element.
     */
    @ViewChild('imgelement', {static: false}) private imageElement: ElementRef;

    /**
     * The reference to the bottom toolbar.
     */
    @ViewChild('bottomtoolbar', {static: false}) private bottomToolbar: ElementRef;

    /**
     * The reference to the toolbar.
     */
    @ViewChild('toolbar', {static: false}) private toolbar: ElementRef;

    /**
     * The base64 encoded string of the image.
     */
    private mediaBase64: SafeResourceUrl = null;

    /**
     * The reference to the cropper object.
     */
    private cropper: any = null;

    /**
     * The message code of the last toast in case of a file type error.
     */
    private fileformatErrorMessageCode: string = null;

    /**
     * The file delivered from the browser - via clipboard or file selection.
     */
    private fileFromBrowser: File = null;

    /**
     * Maximal image width set by the user. The value from the input field (string).
     */
    private maxWidthInput = '';

    /**
     * Maximal image height set by the user. The value from the input field (string).
     */
    private maxHeightInput = '';

    /**
     * Maximal image width set by the user.
     */
    private _maxWidthByUser: number = null;

    /**
     * Maximal image height set by the user.
     */
    private _maxHeightByUser: number = null;

    /**
     * Maximal allowed (by system) pixel width.
     */
    public _maxWidthBySystem: number = null;

    /**
     * Simple getter.
     */
    public get maxWidthBySystem(): number {
        return this._maxWidthBySystem;
    }

    /**
     * Setter for maximal allowed (by system) pixel width.
     */
    @Input('maxWidth') public set maxWidthBySystem( value ) {
        this._maxWidthBySystem = value;
        this.calcTargetSize();
    }

    /**
     * Maximal allowed (by system) pixel height.
     */
    public _maxHeightBySystem: number = null;

    /**
     * Simple getter.
     */
    public get maxHeightBySystem(): number {
        return this._maxHeightBySystem;
    }

    /**
     * Setter for maximal allowed (by system) pixel height.
     */
    @Input('maxHeight') public set maxHeightBySystem( value ) {
        this._maxHeightBySystem = value;
        this.calcTargetSize();
    }

    /**
     * Is the current image cropped?
     */
    private isCropped = false;

    /**
     * Is the current image imported? From clipboard or from file system.
     */
    public isImported = false;

    /**
     * Holds the metadata of the image.
     */
    public mediaMetaData: mediaMetaData;

    /**
     * The internal value for the resize checkbox.
     */
    private _doResizeByUser = false;

    /**
     * Loading indicator. Used for pasting from clipboard.
     */
    private isLoading = false;

    /**
     * The method for unlisten allow pasting an image. This is the listener that catches the past event on the window
     */
    private unlistenPasteEvent: any;

    /**
     * The current x-mirror value of the image.
     */
    private xMirrored = 1;

    /**
     * The current y-mirror value of the image.
     */
    private yMirrored = 1;

    /**
     * The current rotation of the image.
     */
    private currentRotation = 0;

    /**
     * The compression level in case the image for a new jpeg compression the image as jpeg.
     */
    private jpegCompressionLevel = 0.95;

    /**
     * Holds the data of the crop box from the last crop-end event.
     */
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

        // Start listening to the clipboard for an pasted image.
        this.unlistenPasteEvent = this.renderer.listen('window', 'paste', (e: ClipboardEvent) => {
            this.handlePaste(e);
        });

    }

    /**
     * Handles the paste event.
     * @param e The clipboard event from the browser.
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

            if (pastedItem.kind === 'string') {

                pastedItem.getAsString((url: string) => {
                    if (this.stringLooksLikeUrl(url)) {
                        this.resetFileNotAllowedError();
                        this.isLoading = true;
                        this.cd.detectChanges();
                        this.http.get('proxy/?useurl=' + btoa(url), {
                            observe: 'response',
                            responseType: 'blob'
                        }).subscribe(data => {
                            this.isLoading = false;
                            this.cd.detectChanges();
                            this.fileFromBrowser = null;
                            if ( !this.checkMimetype( data.body.type )) { // We only accept a file with these mime types
                                this.showFileNotAllowedError( data.body.type );
                                return;
                            }
                            this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(data.body));
                            this.cd.detectChanges();
                            this.resetMediaMetaData();
                            this.resetModificationStati();
                            this.isImported = true;
                            this.mediaMetaData.filename = url.substring(url.lastIndexOf('/') + 1);
                            this.mediaMetaData.mimetype = data.body.type;
                            this.mediaMetaData.fileformat = this.getFileformatFromMimetype( data.body.type );
                        }, err => {
                            this.isLoading = false;
                        });
                    }
                });

            } else {

                this.resetFileNotAllowedError();
                const blob = pastedItem.getAsFile();
                if ( !this.checkMimetype( blob.type )) { // We only accept a file with these image extensions
                    this.showFileNotAllowedError( blob.type );
                    return;
                }
                this.mediaMetaData.fileformat = this.getFileformatFromMimetype( blob );
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
            this.metaData.fileformat = this.fileformat;
            this.resetModificationStati();
            this.isImported = false;
        }
    }
    */

    /**
     * Resets the image meta data.
     */
    private resetMediaMetaData() {
        this.mediaMetaData = {
            mimetype: null,
            fileformat: null,
            filename: null,
            width: 0,
            height: 0,
            originalWidth: 0,
            originalHeight: 0
        };
    }

    /**
     * Does a given string look like an url?
     * @param string The string.
     */
    private stringLooksLikeUrl(string): boolean {
        return /^(http|https|ftp|file):\/\//.test(string);
    }

    /**
     * Calculates the height of the image/cropper area and returns it for the ngStyle on the element.
     */
    get cropperHeight() {
        try {
            return this.componentHeight - this.toolbar.nativeElement.offsetHeight - this.bottomToolbar.nativeElement.offsetHeight - 5 + 'px';
        } catch (e) {
            return '0px';
        }
    }

    /**
     * Trigger the file selection dialog of the operating system / web browser and prompt the user to select an image.
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

    /**
     * All the stuff that has to be done after the image of the image tag has been loaded.
     * @param event
     */
    private imageLoaded(event): void {

        let image = this.imageElement.nativeElement;

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

    }

    /**
     * The Handler when a file has been dropped.
     * @param droppedFiles
     */
    private onDrop( droppedFiles ): void {
        this.fileFromBrowser = droppedFiles[0];
        this.fileSelectedOrDropped();
    }

    /**
     * Handler in case a file has been dropped externally (image field)
     */
    @Input('droppedFiles') public set onDropExtern( droppedFiles ) {
        if ( droppedFiles ) this.onDrop( droppedFiles );
    }

    /**
     * Get the file type from the mime type.
     * @param fileOrMimetype A file or a string with the mime type.
     */
    private getFileformatFromMimetype(fileOrMimetype: File | string): string {
        if ( fileOrMimetype === null ) return '';
        const mimetype = ( typeof fileOrMimetype === 'object' ? fileOrMimetype.type : fileOrMimetype );
        if ( typeof mimetype === 'string' && /^image\/\w+/.test(mimetype)) return mimetype.split('/').pop();
        return '';
    }

    /**
     * Check if the mimetype is allowed.
     * @param type The mimetype.
     */
    private checkMimetype( type ): boolean {
        return type === 'image/jpeg' || type === 'image/png' || type === 'image/gif';
    }

    /**
     * Show an error toast in case the file is not an image file or the file type is not allowed.
     * @param type The (possibly not allowed) file type.
     */
    private showFileNotAllowedError( mimetype: string | boolean ): void {
        if (this.fileformatErrorMessageCode) this.toast.clearToast(this.fileformatErrorMessageCode);
        this.fileformatErrorMessageCode = this.toast.sendToast('Not an image file or file type ' + ( mimetype ? '"' + mimetype + '"' : '' ) + ' not supported.', 'error', null, false, this.fileformatErrorMessageCode);
    }

    /**
     * Remove the toast of the last file type error.
     */
    private resetFileNotAllowedError() {
        if (this.fileformatErrorMessageCode) this.toast.clearToast(this.fileformatErrorMessageCode);
    }

    /**
     * The handler when a file has been selected from the file selection window of the operating system / web browser.
     */
    private fileSelectionChange(): boolean {
        if (this.fileSelector.nativeElement.files.length === 1) {
            this.fileFromBrowser = this.fileSelector.nativeElement.files[0];
            this.fileSelectedOrDropped();
        }
        this.fileSelector.nativeElement.value = null;
        return false;
    }

    /**
     * The handler when a new file has been imported (dropped or selected).
     */
    private fileSelectedOrDropped(): void {
        this.resetFileNotAllowedError();
        if ( !this.checkMimetype( this.fileFromBrowser.type )) { // We only accept a file with these image extensions
            this.showFileNotAllowedError( this.getFileExtension( this.fileFromBrowser ));
            this.fileFromBrowser = null;
            return;
        }
        this.resetMediaMetaData();
        this.mediaMetaData.fileformat = this.getFileformatFromMimetype(this.fileFromBrowser);
        this.mediaMetaData.filename = this.fileFromBrowser.name;
        this.mediaMetaData.mimetype = this.fileFromBrowser.type;
        this.getMediaFromFileSystem();
    }

    /**
     * Get the file name extension of a file.
     * @param file
     */
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
     * The parent component wants the image (rotated, mirrored, cropped, resized, ...)
     */
    public getImage(): string {

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
            }) // height: this.metaData.height, width:this.metaData.width,
                .toDataURL(this.mediaMetaData.mimetype, this.mediaMetaData.mimetype === 'image/jpeg' ? this.jpegCompressionLevel : undefined);
        } else image = this.mediaBase64.toString();
        return image.substring(image.indexOf('base64,') + 7);
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
     * Removes the cropping frame.
     */
    private removeCropping(): void {
        this.cropper.clear();
        this.isCropped = false;
        this.lastCropBoxData = {};
        this.calcTargetSize();
        this.emitChange();
    }

    /**
     * Offer the possibility to resize the image? (button)
     */
    private get canResize(): boolean {
        return this.allowResizing && this.cropper;
    }

    /**
     * Offer the possibility to mirror the image? (button)
     */
    private get canMirror(): boolean {
        return this.allowMirroring && this.cropper;
    }

    /**
     * Offer the possibility to rotate the image? (button)
     */
    private get canRotate(): boolean {
        return this.allowRotating && this.cropper;
    }

    /**
     * Handler if the user has changed the maximal height of the image.
     */
    private maxHeightChanged(): void {
        let val: number|string;
        val = this.maxHeightInput.split( this.userprefs.toUse.num_grp_sep ).join('');
        val = parseInt( val, 10 );
        this._maxHeightByUser = isNaN(val) ? null : val;
        this.calcTargetSize();
        this.emitChange();
    }

    /**
     * Handler if the user has changed the maximal width of the image.
     */
    private maxWidthChanged(): void {
        let val: number|string;
        val = this.maxWidthInput.split( this.userprefs.toUse.num_grp_sep ).join('');
        val = parseInt( val, 10 );
        this._maxWidthByUser = isNaN(val) ? null : val;
        this.calcTargetSize();
        this.emitChange();
    }

    /**
     * Effective value of maximal pixel height.
     */
    private get maxHeight() {
        if ( this.maxHeightBySystem && this.maxHeightByUser ) return this.maxHeightBySystem < this.maxHeightByUser ? this.maxHeightBySystem : this.maxHeightByUser;
        return this.maxHeightBySystem ? this.maxHeightBySystem : this.maxHeightByUser ? this.maxHeightByUser : null;
    }

    /**
     * Effective value of maximal pixel width.
     */
    private get maxWidth() {
        if ( this.maxWidthBySystem && this.maxWidthByUser ) return this.maxWidthBySystem < this.maxWidthByUser ? this.maxWidthBySystem : this.maxWidthByUser;
        return this.maxWidthBySystem ? this.maxWidthBySystem : this.maxWidthByUser ? this.maxWidthByUser : null;
    }

    /**
     * Gets the internal status for the resize checkbox.
     */
    get doResizeByUser() {
        return this._doResizeByUser;
    }

    /**
     * Sets the internal status for the resize checkbox and recalculates the target size.
     * @param value
     */
    set doResizeByUser( value) {
        this._doResizeByUser = value;
        this.calcTargetSize();
    }

    /**
     * Getter for maximal width when set by the user.
     */
    get maxWidthByUser() {
        return this.doResizeByUser ? this._maxWidthByUser : undefined;
    }

    /**
     * Getter for maximal height when set by the user.
     */
    get maxHeightByUser() {
        return this.doResizeByUser ? this._maxHeightByUser : undefined;
    }

    /**
     * Calculates the size of the target image. Is to be written to object "metaData".
     */
    private calcTargetSize(): void {
        if ( !this.cropper ) return;
        let ratio = 1, height;
        let width = this.cropper.getData(true).width;
        if (width === 0) {
            width = this.cropper.getImageData().naturalWidth;
            height = this.cropper.getImageData().naturalHeight;
        } else height = this.cropper.getData(true).height;
        if ( this.maxWidth && width > this.maxWidth || this.maxHeight && height > this.maxHeight ) {
            if (this.maxWidth && !this.maxHeight) ratio = this.maxWidth / width;
            else if ( this.maxHeight && !this.maxWidth ) ratio = this.maxHeight / height;
            else ratio = this.maxWidth / width < this.maxHeight / height ? this.maxWidth / width : this.maxHeight / height;
            this.mediaMetaData.width = Math.floor(width * ratio);
            this.mediaMetaData.height = Math.floor(height * ratio);
        } else {
            this.mediaMetaData.width = width;
            this.mediaMetaData.height = height;
        }
    }

    public ngOnDestroy(): void {
        if (this.fileformatErrorMessageCode) this.toast.clearToast(this.fileformatErrorMessageCode); // In case there is a open toast.
        this.unlistenPasteEvent(); // Don´t leave event listening.
    }

    /**
     * Zoom into the image.
     */
    private zoomIn() {
        this.cropper.zoom(0.1);
    }

    /**
     * Zoom out of the image.
     */
    private zoomOut() {
        this.cropper.zoom(-0.1);
    }

    /**
     * Mirror the image horizontally.
     */
    public mirrorX(): void {
        // if ... else: Workaround for strange behavior of cropper.js in case the image lies sideways (90 or 270 degrees)
        if (this.currentRotation === 90 || this.currentRotation === 270) this.cropper.scaleY(this.yMirrored = this.yMirrored * -1);
        else this.cropper.scaleX(this.xMirrored = this.xMirrored * -1);
        this.emitChange();
    }

    /**
     * Mirror the image vertically.
     */
    public mirrorY(): void {
        // if ... else: Workaround for strange behavior of cropper.js in case the image lies sideways (90 or 270 degrees)
        if (this.currentRotation === 90 || this.currentRotation === 270) this.cropper.scaleX(this.xMirrored = this.xMirrored * -1);
        else this.cropper.scaleY(this.yMirrored = this.yMirrored * -1);
        this.emitChange();
    }

    /**
     * Rotate the image.
     * @param degrees Number of degrees to rotate.
     */
    public rotate(degrees): void {
        this.currentRotation += degrees;
        this.currentRotation = this.currentRotation % 360;
        if (this.currentRotation < 0) this.currentRotation += 360;
        this.cropper.rotateTo(this.currentRotation);
        this.emitChange();
    }

    /**
     * Is the image rotated?
     */
    private get isRotated(): boolean {
        return this.currentRotation !== 0;
    }

    /**
     * Is the image mirrored?
     */
    private get isMirrored(): boolean {
        return this.xMirrored === -1 || this.yMirrored === -1;
    }

    /**
     * Is the image resized?
     */
    private get isResized(): boolean {
        return this.mediaMetaData.width !== this.mediaMetaData.originalWidth || this.mediaMetaData.height !== this.mediaMetaData.originalHeight;
    }

    /**
     * Is the image edited? That means rotated or mirrored or cropped.
     */
    private get isEdited(): boolean {
        return this.isRotated || this.isMirrored || this.isCropped;
    }

    /**
     * Is the image dirty? That means edited, resized or imported.
     */
    public get isDirty(): boolean {
        return this.isEdited || this.isImported || this.isResized;
    }

    private emitChange() {
        this.mimetype.emit( this.mediaMetaData.mimetype );
        this.onChange( this.getImage() );
    }

    /**
     * Resets all the modification stati.
     */
    private resetModificationStati(): void {
        this.xMirrored = this.yMirrored = 1;
        this.currentRotation = 0;
        this.isCropped = false;
        this.lastCropBoxData = {};
    }

    /**
     * Handler when the user removes all modifications from the image (button).
     */
    private removeModifications(): void {
        this.cropper.rotateTo(0);
        this.cropper.scale(1, 1); // this.cropper.scale( this.xMirrored === -1 ? -1:1, this.yMirrored === -1 ? -1:1 );
        this.cropper.clear();
        this.isCropped = false;
        this.lastCropBoxData = {};
        this.calcTargetSize();
        this.emitChange();
    }

    /**
     * Is editing (cropping or rotating or mirroring) allowed?
     */
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
    public writeValue( value: string ): void {
        if ( value && value != '' ) {
            this.mediaBase64 = this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.mediaMetaData.mimetype + ';base64,' + value );
            this.calcTargetSize();
        }
        this.resetModificationStati();
        this.isImported = false;
    }

}
