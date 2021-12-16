/**
 * @module ModuleGroupware
 */
import {Component} from '@angular/core';
import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {language} from '../../../services/language.service';

/**
 * Outlook add-in beans pane showing a checklist of beans that use the email addresses found in the email.
 * Any beans already linked to the email will have their checkboxes selected.
 */
@Component({
    selector: 'groupware-email-archive-pane-beans',
    templateUrl: '../templates/groupwareemailarchivepanebeans.html'
})
export class GroupwareEmailArchivePaneBeans {

    constructor(
        public groupware: GroupwareService,
        public language: language
    ) {
        this.groupware.loadLinkedBeans();
    }

    /**
     * Related beans.
     */
    get beans() {
        return this.groupware.relatedBeans;
    }
}
