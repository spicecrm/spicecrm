/**
 * @module ObjectComponents
 */
import {
    Component
} from '@angular/core';
import {ObjectActivitiyTimelineAggregates} from './objectactivitiytimelineaggregates';

/**
 * displays the aggregate values that are retrieved from the activityTimelLineService in a template for teh summary view
 */
@Component({
    selector: 'object-activitiy-timeline-summary-aggregates',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinesummaryaggregates.html',
})
export class ObjectActivitiyTimelineSummaryAggregates extends ObjectActivitiyTimelineAggregates {
}
