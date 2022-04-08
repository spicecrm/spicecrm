/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";
import {ActivityTimeline} from "./activitytimeline";


@Component({
    templateUrl: '../templates/activitytimelinetabbed.html',
    providers: [activitiytimeline, modelattachments]
})
export class ActivityTimelineTabbed extends ActivityTimeline implements OnInit, OnDestroy {

    public activetab: 'planned' | 'history' = 'history';

    /**
     * display the summary
     */
    public displaySummary() {
        let routeprefix = '';
        if (this.navigationtab?.tabid) {
            routeprefix = '/tab/' + this.navigationtab.tabid
        }

        this.router.navigate([routeprefix + "/module/" + this.model.module + "/historysummary/" + this.model.id]);
    }

}
