/**
 * @module ModuleGroupware
 */
import {Component, Input} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';

/**
 * An email attachment component.
 */
@Component({
    selector: 'groupware-email-archive-pane-attachment',
    templateUrl: '../templates/groupwareemailarchivepaneattachment.html'
})
export class GroupwareEmailArchivePaneAttachment {

    /**
     * Current attachment.
     */
    @Input() public attachment: any;

    constructor(
        public groupware: GroupwareService,
    ) {}

    public onClick(event) {
        if (event.target.checked) {
            this.groupware.addAttachment(this.attachment);
        } else {
            this.groupware.removeAttachment(this.attachment);
        }
    }
}
