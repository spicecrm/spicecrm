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
import {Component, Input, AfterViewInit, OnInit} from "@angular/core";
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";

/**
 * renders a path with coaching in the context of a model
 *
 * the component embedding this component needs to provide a model
 */
@Component({
    selector: "spice-path-with-coaching",
    templateUrl: "./src/include/spicepath/templates/spicepathwithcoaching.html",
    animations: [
        trigger('displaycoaching', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ]),
        trigger('coachingicon', [
            state('open', style({transform: 'rotate(90deg)'})),
            state('closed', style({transform: 'rotate(0deg)'})),
            transition('open => closed', [
                animate('.5s')
            ]),
            transition('closed => open', [
                animate('.5s')
            ])
        ])
    ]
})
export class SpicePathWithCoaching {

    /**
     * determines if the coaching is visible or not
     */
    private coachingVisible: boolean = false;

    /**
     * holds the current active stage if the user clicks on another stage
     */
    private activeStage: string;

    /**
     * holds current results for the checks
     */
    private beanStagesChecksResults: any[];

    private componentconfig: any = {};

    constructor(private configuration: configurationService, private model: model, private language: language, private backend: backend, private metadata: metadata) {
        this.componentconfig = this.metadata.getComponentConfig('SpicePathWithCoaching', this.model.module);
        if (this.componentconfig && this.componentconfig.coachingVisible) {
            this.coachingVisible = this.componentconfig.coachingVisible;
        }
    }

    /**
     * retrieve results for checks on load
     */
    public ngOnInit() {
        this.backend.getRequest("spicebeanguide/" + this.model.module + "/" + this.model.id).subscribe(stages => {
            this.beanStagesChecksResults = stages;
        });
    }

    /**
     * gets the icon style for the coaching checvron and rotates it by 90degress if open (animated)
     */
    get coachingIconStyle() {
        if (this.coachingVisible) {
            return {
                transform: 'rotate(90deg)'
            };
        } else {
            return {};
        }
    }

    /**
     * returns the stages for the module from teh configuration service
     */
    get stages() {
        return this.configuration.getData('spicebeanguides')[this.model.module].stages;
    }

    /**
     * returns the field on the model that holds the status that is used for the path
     */
    get statusfield() {
        return this.configuration.getData('spicebeanguides')[this.model.module].statusfield;
    }

    get currentStage() {
        return this.model.getField(this.statusfield);
    }

    private toggleCoaching() {
        this.coachingVisible = !this.coachingVisible;
    }

    /**
     * event handler when the active stage is set in the path component
     */
    private setActiveStage(stage) {
        this.activeStage = stage;
    }

    /**
     * simple getter for the stage to be displayed. Returns the current stage or if an active stage is set the active stage
     */
    get displayStage() {
        return this.activeStage ? this.activeStage : this.currentStage;
    }

    /**
     * retrieves the checks for the current stage
     */
    get checks() {
        let checks = []
        this.beanStagesChecksResults.some(stage => {
            if (stage.stage === this.displayStage) {
                checks = stage.stagedata.checks
                return true;
            }
        })
        return checks;
    }

    /**
     * gets the current stage description
     */
    get stageDescription() {
        let stage = this.stages.find(el => el.stage == this.displayStage);

        if (!stage) return '';

        if (stage.stagedata.stage_label) {
            return this.language.getLabel(stage.stagedata.stage_label, '', 'long');
        } else {
            return stage.stagedata.stage_description;
        }
    }

    /**
     * gets the current stage description
     */
    get stageComponentset() {
        let stage = this.stages.find(el => el.stage == this.displayStage);

        if (!stage) return '';

        return stage.stagedata.stage_componentset;
    }
}
