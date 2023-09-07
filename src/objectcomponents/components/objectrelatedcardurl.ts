/**
 * @module ObjectComponents
 */
import {Component, Input} from "@angular/core";
import {toast} from "../../services/toast.service";
import {modelurls} from "../../services/modelurls.service";
import {userpreferences} from "../../services/userpreferences.service";

@Component({
    selector: "[object-related-card-url]",
    templateUrl: "../templates/objectrelatedcardurl.html"
})
export class ObjectRelatedCardUrl {

    /**
     * url data
     */
    @Input() public url: any = {};

    constructor(
        public modelurls: modelurls,
        public userpreferences: userpreferences,
        public toast: toast) {
    }

    /**
     * getter for url date
     */
    get urlDate() {
        return this.url.date ? this.url.date.format(this.userpreferences.getDateFormat()) : '';
    }

    /**
     * getter if we are currently uploading the url
     */
    get uploading() {
        return this.url.hasOwnProperty('uploadprogress');
    }

    /**
     * getter for updating the progress bar
     * */
    get progressbarstyle() {
        return {
            width: this.url.uploadprogress + '%'
        };
    }

    /**
     * opens url in new window tab
     */
    public openUrl() {
        if (this.uploading) {
            this.toast.sendToast('LBL_UPLOAD_IN_PROGRESS', "info");
            return;
        }

        if (this.url) {
            window.open(this.url.url, '_blank').focus();
        }
    }
}
