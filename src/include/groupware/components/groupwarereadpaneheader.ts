import {Component} from '@angular/core';

import {GroupwareService} from '../services/groupware.service';
import {language} from "../../../services/language.service";

@Component({
    selector: 'groupware-read-pane-header',
    templateUrl: './src/include/groupware/templates/groupwarereadpaneheader.html'
})
export class GroupwareReadPaneHeader {

    constructor(
        private language: language,
        private groupware: GroupwareService
    ) {}

    private archive() {
        this.groupware.archiveEmail().subscribe(
            next => {
                // update message
            },
            error => {
                // display error
            },
            () => {
                // Office.context.ui.closeContainer();
                // todo move that into the specific module
            });
    }

    get canArchive() {
        return this.groupware.archiveto.length > 0;
    }

    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
