/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';
import {helper} from "../../services/helper.service";

@Component({
    selector: 'system-image-preview',
    templateUrl: '../templates/systemimagepreview.html'
})
export class SystemImagePreview {

    /**
     * the soruce of the image
     */
    @Input() public imgsrc: string = '';

    /**
     * can be set to true to display a page not available error
     */
    @Input() public loadingerror: boolean = false;

    constructor(
        public language: language,
        public helper: helper) {
    }
    /**
     * a setter for the raw data as Input
     * @param imgData
     */
    @Input() set data(imgData) {
        this.imgsrc = imgData;
    }
}
