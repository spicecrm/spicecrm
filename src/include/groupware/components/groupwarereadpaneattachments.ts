import {Component, ChangeDetectorRef} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {language} from '../../../services/language.service';

/**
 * Outlook add-in pane showing the attachments of the chosen email.
 */
@Component({
    selector: 'groupware-read-pane-attachments',
    templateUrl: './src/include/groupware/templates/groupwarereadpaneattachments.html'
})
export class GroupwareReadPaneAttachments {

    constructor(
        private groupware: GroupwareService,
        private changeDetectorRef: ChangeDetectorRef,
        private language: language
    ) {
        this.loadAttachments();
    }

    /**
     * Getter for the attachment array
     */
    get attachments() {
        return this.groupware.outlookAttachments.attachments;
    }

    /**
     * Loads the attachments in the groupware service.
     */
    public loadAttachments() {
        this.groupware.getAttachments().subscribe(
            (res: any) => {
                this.changeDetectorRef.detectChanges();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
