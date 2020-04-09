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

import {GroupwareService} from '../../../include/groupware/services/groupware.service';
import {backend} from "../../../services/backend.service";

@Component({
    templateUrl: './src/include/outlook/templates/outlookmeetingeditpane.html'
})
export class OutlookMeetingEditPane {

    /**
     * the outlöook meeting id
     */
    private meetingid: string;

    /**
     * the module this is linked to
     */
    private module: string;

    /**
     * the id this is linked to
     */
    private id: string;

    /**
     * the custom properties object
     */
    private customProperties: any;

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
    ) {
        this.groupware.getCalenderItemId().subscribe(id => {
            this.meetingid = id;
        });

        this.groupware.getCustomProperties().subscribe(props => {
            this.customProperties = props;

            this.module = this.customProperties.get('_module');
            this.id = this.customProperties.get('_id');
        });
    }

}
