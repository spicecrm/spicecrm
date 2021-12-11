/**
 * @module ModuleActivities
 */
import {OnInit, Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {activitiytimeline, activityTimeLineModules} from '../../../services/activitiytimeline.service';

/**
 * a component that renders a contianer with activities (past or future) as well as aggergates etc.
 */
@Component({
    selector: 'activitytimeline-container',
    templateUrl: '../templates/activitytimelinecontainer.html',

})
export class ActivityTimelineContainer implements OnInit {

    /**
     * the module to be displayed
     */
    @Input() public module: activityTimeLineModules;

    /**
     * toggles the aggregates to be displayed or not
     */
    @Input() public displayaggregates: boolean = false;

    constructor(public activitiytimeline: activitiytimeline, public language: language) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.activitiytimeline.getTimeLineData(this.module);
    }

    /**
     * a getter for the activities
     */
    get activities() {
        return this.activitiytimeline.activities[this.module].list;
    }

    /**
     * checks if tehera are any activiites to be displayed. Otherwise shows an illustration
     */
    get hasActivities() {
        return this.activitiytimeline.activities[this.module].list.length > 0 ? true : false;
    }

    /**
     * indicator if teh service is loading. This displays stencils
     */
    get loading() {
        return this.activitiytimeline.activities[this.module].loading;
    }

    /**
     * indicator if the service is loading more item . This displays stencils
     */
    get loadingmore() {
        return this.activitiytimeline.activities[this.module].loadingmore;
    }

    /**
     * checks if there are aggregates
     */
    get hasAggregates() {
        try {
            return this.activitiytimeline.activities[this.module].aggregates.module.length > 0;
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
    public trackByFn(index, item) {
        return item.id;
    }
}
