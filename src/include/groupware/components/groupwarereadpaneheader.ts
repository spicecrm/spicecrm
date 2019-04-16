import {Component} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {language} from "../../../services/language.service";

/**
 * A header component used in the Outlook add-in.
 */
@Component({
    selector: 'groupware-read-pane-header',
    templateUrl: './src/include/groupware/templates/groupwarereadpaneheader.html'
})
export class GroupwareReadPaneHeader {

    constructor(
        private language: language,
        private groupware: GroupwareService
    ) {}

    /**
     * Triggers saving the email in SpiceCRM along with the selected beans and/or attachments.
     */
    private archive() {
        this.groupware.archiveEmail().subscribe(
            next => {
                // update message
            },
            error => {
                // display error
            },
            () => {
                // Office.context.ui.closeContainer();
                // todo move that into the specific module
            });
    }

    get canArchive() {
        return this.groupware.archiveto.length > 0;
    }

    /**
     * Checks if the current has already been archived in SpiceCRM.
     */
    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
