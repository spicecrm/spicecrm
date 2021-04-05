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
    templateUrl: './src/modules/activities/templates/activitytimelineaggregates.html',
})
export class ActivityTimelineAggregates {

    @Input() private module: activityTimeLineModules;
    @Input() private labellength: string = 'default';

    constructor(private metadata: metadata, private language: language, private activitiytimeline: activitiytimeline) {
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
    private getElementStyle(module) {
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
    private toggleModuleFilter(module) {
        this.activitiytimeline.toggleModuleFilter(module);
        if (this.metadata.getModuleDefs(module).ftsactivities.Activities) this.activitiytimeline.getTimeLineData('Activities');
        if (this.metadata.getModuleDefs(module).ftsactivities.History) this.activitiytimeline.getTimeLineData('History');
    }
}
