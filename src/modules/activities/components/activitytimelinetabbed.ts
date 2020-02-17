/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";
import {ActivityTimeline} from "./activitytimeline";


@Component({
    templateUrl: './src/modules/activities/templates/activitytimelinetabbed.html',
    providers: [activitiytimeline, modelattachments]
})
export class ActivityTimelineTabbed extends ActivityTimeline implements OnInit, OnDestroy {

    private activetab: 'planned' | 'history' = 'history';

    /**
     * display the summary
     */
    private displaySummary() {
        this.router.navigate(["/module/" + this.model.module + "/historysummary/" + this.model.id]);
    }

}
