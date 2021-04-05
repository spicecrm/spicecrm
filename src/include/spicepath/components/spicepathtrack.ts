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
 * @module ModuleSpicePath
 */
import {Component, Input, AfterViewInit, OnInit, Output, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {broadcast} from "../../../services/broadcast.service";

declare var _: any;

/**
 * renders a path in the context of a model
 *
 * the component embedding this component needs to provide a model
 */
@Component({
    selector: "spice-path-track",
    templateUrl: "./src/include/spicepath/templates/spicepathtrack.html",
})
export class SpicePathTrack implements OnInit{

    /**
     * holds the current active stage if the user clicks on another stage
     */
    private activeStage: string;

    private beanGuideStatus: 'open' | 'won' | 'lost' = 'open';

    private _stages: any[] = [];

    private _modelstage: string;

    /**
     * emits the curetn stage
     */
    @Output() private activeStage$: EventEmitter<string> = new EventEmitter<string>();

    constructor(private configuration: configurationService, private model: model, private language: language) {

    }

    public ngOnInit(): void {
        this.model.data$.subscribe(data => {
            this.buildstages();

            if(this._modelstage != this.model.getField(this.statusfield)){
                this._modelstage = this.model.getField(this.statusfield);
                // set the value internally
                this.activeStage = this._modelstage;
                this.activeStage$.emit(this._modelstage);
            }
        });
    }

    /**
     * builds the stages .. also grouped by the stage_bucket
     */
    private buildstages() {
        let retArray = [];
        let stages = this.configuration.getData('spicebeanguides') ? this.configuration.getData('spicebeanguides')[this.model.module].stages : [];

        // get teh current stage
        let modelstage = this.model.getField(this.statusfield);

        // reset the current status
        this.beanGuideStatus = 'open';

        for (let stage of stages) {
            if (stage.stagedata.stage_bucket) {
                let bucketEntryIndex = retArray.findIndex(retItem => retItem.stagedata.stage_bucket == stage.stagedata.stage_bucket);
                if (bucketEntryIndex >= 0) {
                    if (stage.stage == modelstage) {
                        retArray[bucketEntryIndex] = {stage: stage.stage, stagedata: _.clone(stage.stagedata)};
                        if (stage.stagedata.spicebeanguide_status) this.beanGuideStatus = stage.stagedata.spicebeanguide_status;
                    }
                } else {
                    if (stage.stage == modelstage) {
                        retArray.push({stage: stage.stage, stagedata: _.clone(stage.stagedata)});
                        if (stage.stagedata.spicebeanguide_status) this.beanGuideStatus = stage.stagedata.spicebeanguide_status;
                    } else {
                        let tstage = {stage: stage.stage, stagedata: _.clone(stage.stagedata)};
                        tstage.stagedata.stage_label = stage.stagedata.stage_bucket;
                        retArray.push(tstage);
                    }
                }
            } else {
                retArray.push({stage: stage.stage, stagedata: _.clone(stage.stagedata)});
            }
        }

        this._stages = retArray;
    }

    /**
     * returns the stages for the module from teh configuration service
     */
    get stages() {
        // return this.configuration.getData('spicebeanguides') ? this.configuration.getData('spicebeanguides')[this.model.module].stages : [];
        return this._stages;
    }

    /**
     * returns the field on the model that holds the status that is used for the path
     */
    get statusfield() {
        return this.configuration.getData('spicebeanguides')[this.model.module].statusfield;
    }

    /**
     * used as part of ngClass in the template. This function determines the status of the stage
     *
     * @param currentstage the stage to be evaluated for which the class is queried.
     */
    private stageClass(currentstage) {

        let itemstati = [];

        let modelstatus = this.model.getField(this.statusfield);


        if (this.beanGuideStatus == 'won' && currentstage.stagedata.spicebeanguide_status == 'won') {
            itemstati.push('slds-is-won');
        } else if (this.beanGuideStatus == 'won') {
            itemstati.push('slds-is-complete');
        }

        if (this.beanGuideStatus == 'lost' && currentstage.stagedata.spicebeanguide_status == 'lost') {
            itemstati.push('slds-is-lost');
        } else if (this.beanGuideStatus == 'lost') {
            itemstati.push('slds-is-incomplete');
        }

        // in case we are the acive item set the add class. Special handling for the current one .. both classes conflict so just set one
        if ((this.activeStage && this.activeStage == currentstage.stage) || (!this.activeStage && modelstatus == currentstage.stage)) {
            if (this.beanGuideStatus == 'lost') {
                itemstati.push('slds-is-current');
            } else {
                itemstati.push('slds-is-active');
            }
        }

        if (this.beanGuideStatus == 'open' && modelstatus) {
            let currentIndex = this.stages.findIndex(s => s.stage == currentstage.stage);
            let modelIndex = this.stages.findIndex(s => s.stage == modelstatus);

            if (currentIndex < modelIndex) itemstati.push('slds-is-complete');
            if (currentIndex > modelIndex) itemstati.push('slds-is-incomplete');
            if (currentIndex == modelIndex && itemstati.indexOf('slds-is-active') == -1) itemstati.push('slds-is-current');
        }

        if (!modelstatus) {
            itemstati.push('slds-is-incomplete');
        }

        return itemstati.join(' ');
    }

    /**
     * called from the template when the stage is clicked in the path
     *
     * @param stage the selected stage
     */
    private setActiveStage(stage) {
        // only allow if status is open
        // if(this.beanGuideStatus != 'open') return;

        // set the value internally
        this.activeStage = stage;

        // emit for the parent
        this.activeStage$.emit(stage);
    }


    /**
     * returns the name for the stage to be displayed
     *
     * @param stagedata
     */
    private getStageLabel(stagedata) {
        if (stagedata.stage_label) {
            return this.language.getLabel(stagedata.stage_label);
        } else {
            return stagedata.stage_name;
        }
    }
}
