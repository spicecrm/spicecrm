import {Component, ChangeDetectorRef} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {GroupwareService} from '../services/groupware.service';

import {language} from '../../../services/language.service';

@Component({
    selector: 'groupware-read-pane-linked',
    templateUrl: './src/include/groupware/templates/groupwarereadpanelinked.html'
})
export class GroupwareReadPaneLinked {

    constructor(
        private groupware: GroupwareService,
        private language: language
    ) {
    }

    get beans() {
        return this.groupware.archiveto;
    }

    get attachments() {
        return this.groupware.archiveattachments;
    }

}
