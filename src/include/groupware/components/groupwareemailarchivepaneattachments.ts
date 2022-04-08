/**
 * @module ModuleGroupware
 */
import {Component, ChangeDetectorRef} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {language} from '../../../services/language.service';
import {configurationService} from "../../../services/configuration.service";

/**
 * A list of attachments for the current email.
 */
@Component({
    selector: 'groupware-email-archive-pane-attachments',
    templateUrl: '../templates/groupwareemailarchivepaneattachments.html'
})
export class GroupwareEmailArchivePaneAttachments {

    constructor(
        public groupware: GroupwareService,
        public changeDetectorRef: ChangeDetectorRef,
        public configurationService: configurationService
    ) {
        this.loadAttachments();
    }

    /**
     * select/deselect all attachments based on the checkbox boolean value
     * @param val
     */
    set selectAll(val) {
        if (val) {
            this.groupware.archiveattachments = this.attachments.slice();
        } else {
            this.groupware.archiveattachments = [];
        }
    }

    /**
     * @return true if all attachments are selected
     */
    get selectAll() {
        return this.groupware.archiveattachments.length > 0 && this.groupware.archiveattachments.length == this.attachments.length;
    }

    /**
     * List of attachments.
     */
    get attachments() {
        return this.groupware.attachments.attachments;
    }

    /**
     * Loads a list of the attachments.
     */
    public loadAttachments() {
        this.groupware.getAttachments().subscribe(
            (res: any) => {
                // todo get a list of the already selected attachments
                const checkAll = this.configurationService.getCapabilityConfig('emails').check_all_attachments_on_archive;
                if (!!checkAll) {
                    this.groupware.archiveattachments = this.attachments.slice();
                }
                this.changeDetectorRef.detectChanges();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
