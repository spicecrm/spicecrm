/**
 * @module ModuleGroupware
 */
import {Component, ChangeDetectorRef} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {language} from '../../../services/language.service';

/**
 * A list of attachments for the current email.
 */
@Component({
    selector: 'groupware-email-archive-pane-attachments',
    templateUrl: './src/include/groupware/templates/groupwareemailarchivepaneattachments.html'
})
export class GroupwareEmailArchivePaneAttachments {

    constructor(
        private groupware: GroupwareService,
        private changeDetectorRef: ChangeDetectorRef,
        private language: language
    ) {
        this.loadAttachments();
    }

    /**
     * List of attachments.
     */
    get attachments() {
        return this.groupware.outlookAttachments.attachments;
    }

    /**
     * Loads a list of the attachments.
     */
    public loadAttachments() {
        this.groupware.getAttachments().subscribe(
            (res: any) => {
                // todo get a list of the already selected attachments
                this.changeDetectorRef.detectChanges();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
