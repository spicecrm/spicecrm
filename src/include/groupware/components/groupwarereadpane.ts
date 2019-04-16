import {Component} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';

/**
 * Outlook add-in component showing the navigation tabs for email archiving.
 */
@Component({
    selector: 'groupware-read-pane',
    templateUrl: './src/include/groupware/templates/groupwarereadpane.html'
})
export class GroupwareReadPane {
    private activetab: 'beans' | 'search' | 'attachments' | 'linked' = 'beans';

    constructor(
        private groupware: GroupwareService,
    ) {
        this.groupware.getEmailFromSpice();
    }

    /**
     * Opens a tab.
     *
     * @param tab
     */
    private open(tab) {
        this.activetab = tab;
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
