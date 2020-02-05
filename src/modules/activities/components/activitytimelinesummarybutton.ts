/**
 * @module ModuleActivities
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {Router} from "@angular/router";

@Component({
    selector: 'activitytimeline-summary-button',
    templateUrl: './src/modules/activities/templates/activitytimelinesummarybutton.html',
})
export class ActivityTimelineSummaryButton {

    constructor(private metadata: metadata, private model: model, private language: language, private modal: modal, private router: Router) {
    }

    private displaySummary() {
        this.router.navigate(["/module/" + this.model.module + "/historysummary/" + this.model.id]);
    }
}
