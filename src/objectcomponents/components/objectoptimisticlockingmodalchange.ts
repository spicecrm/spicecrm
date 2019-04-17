/**
 * @module ObjectComponents
 */
import {
    Component,
    Input
} from '@angular/core';

import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {userpreferences} from '../../services/userpreferences.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'object-optimisitclocking-modal-change',
    templateUrl: './src/objectcomponents/templates/objectoptimisticlockingmodalchange.html',
    providers: [view]
})
export class ObjectOptimisticLockingModalChange {

    constructor(private model: model, private language: language,  private userpreferences: userpreferences) {
    }

    @Input() private change: any = {};

    get changeDate() {
        // return timestamp.fromNow();
        let timestamp = moment(this.change.date_created).tz(moment.tz.guess());
        timestamp.add(timestamp.utcOffset(), "m");
        return timestamp.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
    }

}
