/**
 * @module ModuleActivities
 */
import {
    Component, OnDestroy, ViewChild, ViewContainerRef, Input
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {activitiytimeline, activityTimeLineModules} from '../../../services/activitiytimeline.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays the aggregate values that are retrieved from the activitzyTimelLineService
 */
@Component({
    selector: 'activity-timeline-aggregates',
    templateUrl: '../templates/activitytimelineaggregates.html',
})
export class ActivityTimelineAggregates {

    @Input() public module: activityTimeLineModules;
    @Input() public labellength: string = 'default';

    constructor(public metadata: metadata, public language: language, public activitiytimeline: activitiytimeline) {
    }

    /**
     * a getter for the aggregates from the service
     */
    get moduleaggregates() {
        return this.module && this.activitiytimeline.activities[this.module].aggregates.module ? this.activitiytimeline.activities[this.module].aggregates.module : [];
    }

    /**
     * a getter for the aggregates from the service
     */
    get yearaggregates() {
        return this.module && this.activitiytimeline.activities[this.module].aggregates.year ? this.activitiytimeline.activities[this.module].aggregates.year : [];
    }

    /**
     * gets a style for the icon to grey it out and set 50% opacity
     * @param module
     */
    public getElementStyle(module) {
        if (!this.activitiytimeline.checkModuleActive(module)) {
            return {
                filter: 'grayscale(100%)',
                opacity: '0.5'
            };
        }
    }

    /**
     * toggles a module filter wither on or off and reloads the proper parts of the service
     *
     * @param module the module that is being toggled
     */
    public toggleModuleFilter(module) {
        this.activitiytimeline.toggleModuleFilter(module);
        if (this.metadata.getModuleDefs(module).ftsactivities.Activities) this.activitiytimeline.getTimeLineData('Activities');
        if (this.metadata.getModuleDefs(module).ftsactivities.History) this.activitiytimeline.getTimeLineData('History');
    }
}
