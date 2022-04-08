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
    templateUrl: "../templates/spicepathwithcoaching.html",
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
    public coachingVisible: boolean = false;

    /**
     * holds the current active stage if the user clicks on another stage
     */
    public activeStage: string;

    /**
     * holds current results for the checks
     */
    public beanStagesChecksResults: any[];

    public componentconfig: any = {};

    constructor(public configuration: configurationService, public model: model, public language: language, public backend: backend, public metadata: metadata) {
        this.componentconfig = this.metadata.getComponentConfig('SpicePathWithCoaching', this.model.module);
        if (this.componentconfig && this.componentconfig.coachingVisible) {
            this.coachingVisible = this.componentconfig.coachingVisible;
        }
    }

    /**
     * retrieve results for checks on load
     */
    public ngOnInit() {
        this.backend.getRequest("common/spicebeanguide/" + this.model.module + "/" + this.model.id).subscribe(stages => {
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

    public toggleCoaching() {
        this.coachingVisible = !this.coachingVisible;
    }

    /**
     * event handler when the active stage is set in the path component
     */
    public setActiveStage(stage) {
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
