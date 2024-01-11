/**
 * @module SystemComponents
 */
import { Component, EventEmitter, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {language} from '../../services/language.service';
import {helper} from "../../services/helper.service";
import { Subscription } from 'rxjs';

/**
 * a modal that renders and provides a preview for an object
 */
@Component({
    selector: 'system-object-preview',
    templateUrl: '../templates/systemobjectpreview.html'
})
export class SystemObjectPreview {

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    public blobUrl: SafeResourceUrl;

    /**
     * the name of the object. This is displayed in the header
     */
    @Input() public name: string = '';

    /**
     * can be set to true to display a page not available error
     */
    @Input() public loadingerror: boolean = false;

    /**
     * raw data of the object being passed in. When the data is passed in the blob url is created
     */
    private rawData: string;

    /**
     * Indicates that setBlobUrl() is finished and the download is available.
     */
    public downloadReady = false;

    @ViewChild('downloadlink', {read: ViewContainerRef, static: false }) private downloadlink: ViewContainerRef;

    public subscriptions: Subscription = new Subscription();

    @Input() public objectContainerHeight = '80vh';

    constructor(
        public language: language,
        public sanitizer: DomSanitizer,
        public helper: helper) {
    }

    /**
     * file type
     */
    private _type: string = '';

    /**
     * retrieve file type
     */
    get type() {
        return this._type;
    }

    /**
     * set file type of the object that will be passed in
     */
    @Input() set type(val: string) {
        this._type = val;

        // create blob url if we've got the file type
        if (!this.blobUrl && val) this.setBlobUrl(this.rawData);
    }

    /**
     * a setter for the raw data as Input
     * @param rawData
     */
    @Input() set data(rawData) {
        this.rawData = rawData;
        this.setBlobUrl(rawData);
    }

    /**
     * Notifies the component, that - somewhere outside - a download button or download menu item has been clicked.
     */
    @Input() downloadTrigger$: EventEmitter<void>;

    public ngOnInit() {
        if ( this.downloadTrigger$ ) this.subscriptions.add(
            this.downloadTrigger$.subscribe( {
                next:
                    () => {
                        if ( this.downloadReady ) this.downloadlink.element.nativeElement.click();
                    }
            })
        );
    }

    /**
     * translates the type passed in into the proper obejcttype
     */
    get objecttype() {
        if (!this.type) return '';

        let typeArray = this.type.split("/");
        switch (typeArray[0]) {
            case 'audio':
            case 'video':
                return typeArray[0];
            default:
                return 'object';
        }
    }

    /**
     * process raw file data
     * generate blob url
     * @param rawData
     * @private
     */
    private setBlobUrl(rawData) {
        if (rawData && !!this.type) {
            const blob = this.helper.datatoBlob(rawData, this.type);
            this.blobUrl = this.helper.dataToBlobUrl(blob);
            this.downloadReady = true;
        }
    }

    /*
     * @unsubscribe subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns the style
     */
    get objectContainerStyle(){
        return {
            height: this.objectContainerHeight,
            overflow: 'hidden'
        }
    }
}
