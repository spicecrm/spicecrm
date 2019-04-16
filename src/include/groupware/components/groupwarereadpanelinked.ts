import {Component} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {language} from '../../../services/language.service';

/**
 * Outlook add-in pane showing a list of beans and/or attachments chosen to be archived in SpiceCRM with an email.
 */
@Component({
    selector: 'groupware-read-pane-linked',
    templateUrl: './src/include/groupware/templates/groupwarereadpanelinked.html'
})
export class GroupwareReadPaneLinked {

    constructor(
        private groupware: GroupwareService,
        private language: language
    ) {
    }

    /**
     * Getter for the selected bean array.
     */
    get beans() {
        return this.groupware.archiveto;
    }

    /**
     * Getter for the selected attachments array.
     */
    get attachments() {
        return this.groupware.archiveattachments;
    }

}
