/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit, Optional} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {model} from '../../../services/model.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {modelattachments} from "../../../services/modelattachments.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {metadata} from "../../../services/metadata.service";
import {layout} from "../../../services/layout.service";
import {Router} from "@angular/router";

/**
 * @ignore
 */
declare var moment;

@Component({
    templateUrl: './src/modules/activities/templates/activitytimeline.html',
    providers: [activitiytimeline]
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

    constructor(public model: model,
                public router: Router,
                public language: language,
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

    private toggleAggregates(module: string, e: MouseEvent) {
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
     * toggles the open and closed state on the timeline service
     */
    private toggleOpen() {
        this.activitiytimeline.openness = !this.activitiytimeline.openness;
    }

    /**
     * returns if the formfactor in teh layout servic eis small
     */
    get isSmall() {
        return this.layout.screenwidth == 'small';
    }
}
