/**
 * @module ModuleActivities
 */
import {
    Component
} from '@angular/core';
import {ActivityTimelineAggregates} from './activitytimelineaggregates';

/**
 * displays the aggregate values that are retrieved from the activityTimelLineService in a template for teh summary view
 */
@Component({
    selector: 'activity-timeline-summary-aggregates',
    templateUrl: '../templates/activitytimelinesummaryaggregates.html',
})
export class ActivityTimelineSummaryAggregates extends ActivityTimelineAggregates {
}
