/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {activitiyTimeLineService} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {metadata} from "../../../services/metadata.service";

/**
 * @ignore
 */
declare var moment;

@Component({
    templateUrl: './src/modules/activities/templates/activitytimeline.html',
    providers: [activitiyTimeLineService, modelattachments]
})
export class ActivityTimeline implements OnInit, OnDestroy {

    /**
     * the componentconfig
     */
    private componentconfig: any = {};

    /**
     * the aggregates to be displayed
     */
    private displayaggregates = {
        Activities: false,
        History: false
    };

    constructor(private model: model,
                private language: language,
                private activitiyTimeLineService: activitiyTimeLineService,
                public metadata: metadata,
                public utils: modelutilities,
                public injector: Injector) {

    }

    /**
     * getter for the searchterm
     */
    get ftsSearchTerm() {
        return this.activitiyTimeLineService.filters.searchterm;
    }

    /**
     * setter for the searchterm. When entered will also start a reload
     *
     * @param searchterm the searchterm
     */
    set ftsSearchTerm(searchterm) {
        this.activitiyTimeLineService.filters.searchterm = searchterm;
        this.activitiyTimeLineService.reload();
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

    public ngOnInit() {
        this.activitiyTimeLineService.parent = this.model;


        if (this.componentconfig.usefts) this.activitiyTimeLineService.usefts = true;
        if (this.componentconfig.defaultentries) this.activitiyTimeLineService.defaultLimit = this.componentconfig.defaultentries;

    }

    /**
     * stops the subscription
     */
    public ngOnDestroy() {
        this.activitiyTimeLineService.stopSubscriptions();
    }

    /**
     * reloads the activities stream
     */
    public reload() {
        if (this.displayActivitiesContainer) this.activitiyTimeLineService.getTimeLineData('Activities');
        this.activitiyTimeLineService.getTimeLineData('History');
    }

    public loadMore(module) {
        this.activitiyTimeLineService.getMoreTimeLineData(module, 5);
    }
}
