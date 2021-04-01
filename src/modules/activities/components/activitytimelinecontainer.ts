/*
SpiceUI 2018.10.001

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
import {OnInit, Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';
import {activitiytimeline, activityTimeLineModules} from '../../../services/activitiytimeline.service';

/**
 * a component that renders a contianer with activities (past or future) as well as aggergates etc.
 */
@Component({
    selector: 'activitytimeline-container',
    templateUrl: './src/modules/activities/templates/activitytimelinecontainer.html',

})
export class ActivityTimelineContainer implements OnInit {

    /**
     * the module to be displayed
     */
    @Input() private module: activityTimeLineModules;

    /**
     * toggles the aggregates to be displayed or not
     */
    @Input() private displayaggregates: boolean = false;

    constructor(private activitiytimeline: activitiytimeline, private language: language) {
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
    private trackByFn(index, item) {
        return item.id;
    }
}
