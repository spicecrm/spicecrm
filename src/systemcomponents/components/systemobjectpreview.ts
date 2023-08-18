/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {language} from '../../services/language.service';
import {helper} from "../../services/helper.service";

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
    public blobUrl: any;

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
     * a download option in teh window that triggers creation of a link elekent and simulates a click. This will prompt the download in the UI
     */
    public download() {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = this.blobUrl;
        a.download = this.name;
        a.click();
        a.remove();
    }

    /**
     * process raw file data
     * generate blob url
     * @param rawData
     * @private
     */
    private setBlobUrl(rawData) {
        if (rawData && !!this.type) {
            let blob = this.helper.datatoBlob(rawData, this.type);
            this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        }
    }
}
