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
    templateUrl: './src/modules/activities/templates/activitytimelinesummarybutton.html',
})
export class ActivityTimelineSummaryButton {

    constructor(private model: model, private language: language, private router: Router, @Optional() private navigationtab: navigationtab) {
    }

    /**
     * navigate to the summary for the activities
     */
    private displaySummary() {
        let routeprefix = '';
        if (this.navigationtab?.tabid) {
            routeprefix = '/tab/' + this.navigationtab.tabid
        }

        this.router.navigate([routeprefix + "/module/" + this.model.module + "/historysummary/" + this.model.id]);
    }
}
