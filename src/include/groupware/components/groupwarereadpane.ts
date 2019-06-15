import {Component} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'groupware-read-pane',
    templateUrl: './src/include/groupware/templates/groupwarereadpane.html'
})
export class GroupwareReadPane {
    private activetab: 'beans' | 'search' | 'attachments' | 'linked' = 'beans';

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
    ) {
        this.groupware.getEmailFromSpice();
    }

    private open(tab) {
        this.activetab = tab;
    }

    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
