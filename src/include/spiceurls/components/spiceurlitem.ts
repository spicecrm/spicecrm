/**
 * @module ModuleSpiceUrls
 */
import { Component, Input, Injector} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {toast} from "../../../services/toast.service";
import {modelurls} from "../../../services/modelurls.service";

/**
 * displays an url
 */
@Component({
    selector: 'spice-url-item',
    templateUrl: '../templates/spiceurlitem.html',
})
export class SpiceUrlItem {

    /**
     * the urlItem
     */
    @Input() public urlItem: any = {};


    /**
     * if we are editing and thus can unlink urlItems
     */
    @Input() public editmode: boolean = true;

    /**
     * the modelurls service
     * passed in as input since the container knows if self or parent element
     */
    @Input() public modelurls: modelurls;

    constructor(
        public userpreferences: userpreferences,
        public modal: modal,
        public toast: toast,
        public helper: helper,
        public injector: Injector) {
    }

    get urlItemDate() {
        return this.urlItem.date ? this.urlItem.date.format(this.userpreferences.getDateFormat()) : '';
    }

    get uploading() {
        return this.urlItem.hasOwnProperty('uploadprogress');
    }

    get progressbarstyle() {
        return {
            width: this.urlItem.uploadprogress + '%'
        };
    }

    /**
     * opens url in a new browser tab
     * @param e
     */
    public openUrl(e) {
        // stop the event from bubbling
        e.preventDefault();
        e.stopPropagation();

        if (this.uploading) {
            this.toast.sendToast('upload still in progress', "info");
            return;
        }

        if (this.urlItem.urlItem_mime_type) {
            // open the url in a new browser tab
        }
  
    }

    /**
     * action to delete the urlItem
     */
    public deleteUrl() {
        if (this.editmode) {
            this.modelurls.deleteUrl(this.urlItem.id);
        }
    }
}
