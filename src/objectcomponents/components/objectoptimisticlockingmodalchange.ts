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
    templateUrl: '../templates/objectoptimisticlockingmodalchange.html',
    providers: [view]
})
export class ObjectOptimisticLockingModalChange {

    constructor(public model: model, public language: language,  public userpreferences: userpreferences) {
    }

    @Input() public change: any = {};

    get changeDate() {
        // return timestamp.fromNow();
        let timestamp = moment(this.change.date_created).tz( this.userpreferences.toUse.timezone );
        timestamp.add(timestamp.utcOffset(), "m");
        return timestamp.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat());
    }

}
