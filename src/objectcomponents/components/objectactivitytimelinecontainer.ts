/**
 * @module ObjectComponents
 */
import {OnInit, Component, Input} from '@angular/core';
import {language} from '../../services/language.service';
import {activitiyTimeLineService, activityTimeLineModules} from '../../services/activitiytimeline.service';

/**
 * a component that renders a contianer with activities (past or future) as well as aggergates etc.
 */
@Component({
    selector: 'object-activitiytimeline-container',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinecontainer.html',

})
export class ObjectActivitiyTimelineContainer implements OnInit {

    /**
     * the module to be displayed
     */
    @Input() private module: activityTimeLineModules;

    /**
     * toggles the aggregates to be displayed or not
     */
    @Input() private displayaggregates: boolean = false;

    constructor(private activitiyTimeLineService: activitiyTimeLineService, private language: language) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.activitiyTimeLineService.getTimeLineData(this.module);
    }

    /**
     * a getter for the activities
     */
    get activities() {
        return this.activitiyTimeLineService.activities[this.module].list;
    }

    /**
     * checks if tehera are any activiites to be displayed. Otherwise shows an illustration
     */
    get hasActivities() {
        return this.activitiyTimeLineService.activities[this.module].list.length > 0 ? true : false;
    }

    /**
     * indicator if teh service is loading. This displays stencils
     */
    get loading() {
        return this.activitiyTimeLineService.activities[this.module].loading;
    }

    /**
     * checks if there are aggregates
     */
    get hasAggregates() {
        try {
            return this.activitiyTimeLineService.activities[this.module].aggregates.module.length > 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * @ignore
     *
     * a trackby function for the loop
     *
     * @param index
     * @param item
     */
    private trackByFn(index, item) {
        return item.data.id;
    }
}
