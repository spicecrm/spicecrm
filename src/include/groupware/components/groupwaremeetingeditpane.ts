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
    templateUrl: './src/include/groupware/templates/groupwaremeetingeditpane.html'
})
export class GroupwareMeetingEditPane {

    private meetingid: string;

    private customProperties: any;

    constructor(
        private backend: backend,
        private groupware: GroupwareService,
    ) {
        this.groupware.getCalenderItemId().subscribe(id => {
            this.meetingid = id ? id : 'meeting is new';
        });

        this.groupware.getCustomProperties().subscribe(props => {
            this.customProperties = props;

            if(!this.customProperties.get('accountid')){
                this.customProperties.set('accountid', '4711');
                this.customProperties.saveAsync(resp => {
                    console.log(resp);
                });
            }
        });
    }

}
