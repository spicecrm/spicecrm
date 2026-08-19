/**
 * @module ModuleActivities
 */
import {
    Component, Optional
} from '@angular/core';
import {model} from '../../../services/model.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {Router} from "@angular/router";

/**
 * renders a summary button for the activity stream
 */
@Component({
    selector: 'activitytimeline-summary-button',
    templateUrl: '../templates/activitytimelinesummarybutton.html',
    standalone: false
})
export class ActivityTimelineSummaryButton {

    constructor(
        public model: model,
        public activitiytimeline: activitiytimeline,
        public router: Router,
        @Optional() public navigationtab: navigationtab
    ) {
    }

    /**
     * return if we have history items - otherwise the summary makes no sense
     */
    get hasItems(){
        return this.activitiytimeline.activities.History.totalcount > 0;
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
