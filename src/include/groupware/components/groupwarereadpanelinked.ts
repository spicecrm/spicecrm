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
    selector: 'groupware-read-pane-linked',
    templateUrl: './src/include/groupware/templates/groupwarereadpanelinked.html'
})
export class GroupwareReadPaneLinked {

    constructor(
        private groupware: GroupwareService,
        private language: language
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
