/**
 * @module ObjectComponents
 */
import {
    Component, OnDestroy, ViewChild, ViewContainerRef, Input
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {activitiyTimeLineService, activityTimeLineModules} from '../../../services/activitiytimeline.service';

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays the aggregate values that are retrieved from the activitzyTimelLineService
 */
@Component({
    selector: 'activity-timeline-aggregates',
    templateUrl: './src/modules/activities/templates/activitytimelineaggregates.html',
})
export class ActivityTimelineAggregates {

    @Input() private module: activityTimeLineModules;
    @Input() private labellength: string = 'default';

    constructor(private metadata: metadata, private language: language, private activitiyTimeLineService: activitiyTimeLineService) {
    }

    /**
     * a getter for the aggregates from the service
     */
    get moduleaggregates() {
        return this.module && this.activitiyTimeLineService.activities[this.module].aggregates.module ? this.activitiyTimeLineService.activities[this.module].aggregates.module : [];
    }

    /**
     * a getter for the aggregates from the service
     */
    get yearaggregates() {
        return this.module && this.activitiyTimeLineService.activities[this.module].aggregates.year ? this.activitiyTimeLineService.activities[this.module].aggregates.year : [];
    }

    /**
     * gets a style for the icon to grey it out and set 50% opacity
     * @param module
     */
    private getElementStyle(module) {
        if (!this.activitiyTimeLineService.checkModuleActive(module)) {
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
    private toggleModuleFilter(module) {
        this.activitiyTimeLineService.toggleModuleFilter(module);
        if (this.metadata.getModuleDefs(module).ftsactivities.Activities) this.activitiyTimeLineService.getTimeLineData('Activities');
        if (this.metadata.getModuleDefs(module).ftsactivities.History) this.activitiyTimeLineService.getTimeLineData('History');
    }
}
