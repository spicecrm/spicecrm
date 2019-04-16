import {Component, Input} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';

/**
 * Renders an email attachment in the attachment checklist.
 */
@Component({
    selector: 'groupware-pane-attachment',
    templateUrl: './src/include/groupware/templates/groupwarepaneattachment.html'
})
export class GroupwarePaneAttachment {

    @Input() private attachment: any;

    constructor(
        private groupware: GroupwareService,
    ) {}

    /**
     * Toggles checkbox selection.
     *
     * @param event
     */
    private onClick(event) {
        if (event.target.checked) {
            this.groupware.addAttachment(this.attachment);
        } else {
            this.groupware.removeAttachment(this.attachment);
        }
    }
}
