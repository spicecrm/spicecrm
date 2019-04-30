import {Component} from '@angular/core';
import {GroupwareService} from '../services/groupware.service';
import {language} from '../../../services/language.service';

/**
 * Outlook add-in beans pane showing a checklist of beans that use the email addresses found in the email.
 * Any beans already linked to the email will have their checkboxes selected.
 */
@Component({
    selector: 'groupware-read-pane-beans',
    templateUrl: './src/include/groupware/templates/groupwarereadpanebeans.html'
})
export class GroupwareReadPaneBeans {

    constructor(
        private groupware: GroupwareService,
        private language: language
    ) {
        this.groupware.loadLinkedBeans();
    }

    get beans() {
        return this.groupware.relatedBeans;
    }
}
