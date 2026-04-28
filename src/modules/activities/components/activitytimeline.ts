/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit, Optional} from '@angular/core';
import {navigationtab} from '../../../services/navigationtab.service';
import {model} from '../../../services/model.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {modelutilities} from "../../../services/modelutilities.service";
import {metadata} from "../../../services/metadata.service";
import {layout} from "../../../services/layout.service";
import {Router} from "@angular/router";

/**
 * @ignore
 */
declare var moment;

@Component({
    selector: 'activity-timeline',
    templateUrl: '../templates/activitytimeline.html',
    providers: [activitiytimeline],
    standalone: false
})
export class ActivityTimeline implements OnInit, OnDestroy {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * the aggregates to be displayed
     */
    public displayaggregates = {
        Activities: false,
        History: false
    };

    constructor(public model: model,
                public router: Router,
                public activitiytimeline: activitiytimeline,
                public metadata: metadata,
                public utils: modelutilities,
                public layout: layout,
                @Optional() public navigationtab: navigationtab,
                public injector: Injector
    ) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.activitiytimeline.parent = this.model;
        if (this.componentconfig.usefts) this.activitiytimeline.usefts = true;
        if (this.componentconfig.defaultentries) this.activitiytimeline.defaultLimit = this.componentconfig.defaultentries;
    }

    /**
     * getter for the searchterm
     */
    get ftsSearchTerm() {
        return this.activitiytimeline.filters.searchterm;
    }

    /**
     * setter for the searchterm. When entered will also start a reload
     *
     * @param searchterm the searchterm
     */
    set ftsSearchTerm(searchterm) {
        this.activitiytimeline.filters.searchterm = searchterm;
        this.activitiytimeline.reload();
    }

    /**
     * indicates if the add container is shown
     */
    get displayAddContainer() {
        return !this.componentconfig.hideaddcontainer;
    }

    /**
     * indicates if the add container is shown
     */
    get displayActivitiesContainer() {
        return !this.componentconfig.hideactivitiescontainer;
    }

    /**
     * stops the subscription
     */
    public ngOnDestroy() {
        this.activitiytimeline.stopSubscriptions();
    }

    /**
     * reloads the activities stream
     */
    public reload() {
        if (this.displayActivitiesContainer) this.activitiytimeline.getTimeLineData('Activities');
        this.activitiytimeline.getTimeLineData('History');
    }

    public toggleAggregates(module: string, e: MouseEvent) {
        e.stopPropagation();
        this.displayaggregates[module] = !this.displayaggregates[module];
    }

    /**
     * loads more items
     *
     * @param module
     */
    public loadMore(module) {
        this.activitiytimeline.getMoreTimeLineData(module, this.componentconfig.defaultentries);
    }

    /**
     * check if we can toggle
     */
    get canToggleOpen(){
        return this.activitiytimeline.activities.Activities.totalcount > 0 || this.activitiytimeline.activities.History.totalcount > 0;
    }

    /**
     * toggles the open and closed state on the timeline service
     */
    public toggleOpen() {
        this.activitiytimeline.openness = !this.activitiytimeline.openness;
    }

    /**
     * returns if the formfactor in teh layout servic eis small
     */
    get isSmall() {
        return this.layout.screenwidth == 'small';
    }
}
