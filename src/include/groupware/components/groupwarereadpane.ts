/**
 * @module ModuleGroupware
 */
import {Component} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {backend} from "../../../services/backend.service";

/**
 * A groupware container for the tabs and their content.
 * Those include: beans list, search pane, attachment list, linked bean list.
 */
@Component({
    selector: 'groupware-read-pane',
    templateUrl: './src/include/groupware/templates/groupwarereadpane.html'
})
export class GroupwareReadPane {
    /**
     * Currently active tab.
     */
    private activetab: 'beans' | 'search' | 'attachments' | 'linked' = 'beans';

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
    ) {
        this.groupware.getEmailFromSpice();
    }

    /**
     * Sets a tab as open and displays its content.
     * @param tab
     */
    private open(tab) {
        this.activetab = tab;
    }

    /**
     * Checks if the current email has already been archived in SpiceCRM.
     */
    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
