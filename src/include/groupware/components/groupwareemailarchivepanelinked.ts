/**
 * @module ModuleGroupware
 */
import {Component, ChangeDetectorRef} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';

import {language} from '../../../services/language.service';

/**
 * A component showing the beans and attachments that are linked to the currently opened email.
 */
@Component({
    selector: 'groupware-email-archive-pane-linked',
    templateUrl: '../templates/groupwareemailarchivepanelinked.html'
})
export class GroupwareEmailArchivePaneLinked {

    constructor(
        public groupware: GroupwareService,
        public language: language
    ) {}

    /**
     * Linked beans.
     */
    get beans() {
        return this.groupware.archiveto;
    }

    /**
     * Linked attachments.
     */
    get attachments() {
        return this.groupware.archiveattachments;
    }

}
