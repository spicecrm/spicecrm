/**
 * @module ModuleActivities
 */
import {
    Component, Optional
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {Router} from "@angular/router";

/**
 * renders a summary button for the activity stream
 */
@Component({
    selector: 'activitytimeline-summary-button',
    templateUrl: '../templates/activitytimelinesummarybutton.html',
})
export class ActivityTimelineSummaryButton {

    constructor(public model: model, public language: language, public router: Router, @Optional() public navigationtab: navigationtab) {
    }

    /**
     * navigate to the summary for the activities
     */
    public displaySummary() {
        let routeprefix = '';
        if (this.navigationtab?.tabid) {
            routeprefix = '/tab/' + this.navigationtab.tabid
        }

        this.router.navigate([routeprefix + "/module/" + this.model.module + "/historysummary/" + this.model.id]);
    }
}
