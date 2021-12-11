/**
 * @module ModuleGroupware
 */
import {Component, ChangeDetectorRef} from '@angular/core';

import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {language} from "../../../services/language.service";

/**
 * Header component for the add-in.
 */
@Component({
    selector: 'groupware-email-archive-pane-header',
    templateUrl: '../templates/groupwareemailarchivepaneheader.html'
})
export class GroupwareEmailArchivePaneHeader {

    constructor(
        public language: language,
        public groupware: GroupwareService,
        public cdRef: ChangeDetectorRef
    ) {}

    /**
     * Archives an email in SpiceCRM.
     */
    public archive() {
        this.groupware.archiveEmail().subscribe(
            next => {
                // update message
            },
            error => {
                // display error
            },
            () => {
                this.cdRef.detectChanges();
            });
    }

    /**
     * Check if there are any beans to be archived.
     */
    get canArchive() {
        return this.groupware.archiveto.length > 0 && !this.groupware.isArchiving;
    }

    /**
     * Check if the email has already been archived.
     */
    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
