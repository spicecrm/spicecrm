import {Component, Input} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';

@Component({
    selector: 'groupware-pane-attachment',
    templateUrl: './src/include/groupware/templates/groupwarepaneattachment.html'
})
export class GroupwarePaneAttachment {

    @Input() private attachment: any;

    constructor(
        private groupware: GroupwareService,
    ) {
    }

    private onClick(event) {
        if (event.target.checked) {
            this.groupware.addAttachment(this.attachment);
        } else {
            this.groupware.removeAttachment(this.attachment);
        }
    }
}
