/*view und model providen
fieldset laden mit parent feld
auf model data subscriben
parent type und parent id in das exchange object reinschreiben (extended field)



im xml die neue route im appointment manager pane
nach dem speichern im exchange sollte es ein notification zum spicecrm schicken



checken ob das meeting schon im crm ist -> dann zeigen
wenn nicht einfach das von oben zeigen


wenn es nicht in spice ist aber parent type,id und exchange id dann abspeichern (und dann im hintergrund den rest holen)
*/
import {Component} from "@angular/core";
// import {model} from "../../../services/model.service";
// import {view} from "../../../services/view.service";

import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {backend} from "../../../services/backend.service";


@Component({
    selector: 'groupware-meeting-pane',
    templateUrl: './src/include/groupware/templates/groupwaremeetingpane.html'
})
export class GroupwareMeetingPane {
    /**
     * Currently active tab.
     */
    private activetab: 'beans' | 'search' | 'attachments' | 'linked' = 'beans';

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
    ) {
        this.groupware.getEmailFromSpice();
    }

    /**
     * Sets a tab as open and displays its content.
     * @param tab
     */
    private open(tab) {
        this.activetab = tab;
    }

    /**
     * Checks if the current email has already been archived in SpiceCRM.
     */
    get isArchived() {
        if (this.groupware.emailId.length === 0) {
            return false;
        }

        return true;
    }
}
