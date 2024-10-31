/**
 * @module ModuleSpicePath
 */
import {Component, Input, AfterViewInit, OnInit, Output, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {broadcast} from "../../../services/broadcast.service";
import {metadata} from "../../../services/metadata.service";

declare var _: any;

/**
 * renders a path in the context of a model
 *
 * the component embedding this component needs to provide a model
 */
@Component({
    selector: "spice-path-track",
    templateUrl: "../templates/spicepathtrack.html",
})
export class SpicePathTrack implements OnInit{

    /**
     * holds the current active stage if the user clicks on another stage
     */
    public activeStage: string;

    public beanGuideStatus: 'open' | 'won' | 'lost' = 'open';

    public _stages: any[] = [];

    public _modelstage: string;

    /**
     * emits the curetn stage
     */
    @Output() public activeStage$: EventEmitter<string> = new EventEmitter<string>();

    constructor(public configuration: configurationService,
                public model: model,
                private metadata: metadata,
                public language: language) {

    }

    public ngOnInit(): void {
        this.model.data$.subscribe(data => {
            this.buildstages();

            if(this._modelstage != this.model.getField(this.statusfield)){
                this._modelstage = this.model.getField(this.statusfield);
                this.activeStage = this._modelstage;
                this.activeStage$.emit(this._modelstage);
            }
        });
    }

    /**
     * builds the stages .. also grouped by the stage_bucket
     */
    public buildstages() {
        let retArray = [];
        let stages;

        const config = this.metadata.getComponentConfig('SpicePathWithCoaching', this.model.module);
        const moduleKanbans = this.configuration.getData('spicebeanguides')[this.model.module];

        if (!Array.isArray(moduleKanbans) || moduleKanbans.length == 0) return;

        if (!config?.kanban) {
            stages = moduleKanbans.find(k => k.is_default == 1).stages;

        } else {
            stages = moduleKanbans.find(k => k.id == config.kanban)?.stages ?? [];
        }

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
            const guides = this.configuration.getData('spicebeanguides');
            const moduleKanbans = guides?.[this.model.module];

            if (!Array.isArray(moduleKanbans) || moduleKanbans.length === 0) return;

            // Try to get the default kanban first
            const defaultKanban = moduleKanbans.find(k => k.is_default == 1);
            if (!defaultKanban?.statusfield) {
                throw new Error('Status field not found in default kanban');
            }

            return defaultKanban.statusfield;
    }

    /**
     * used as part of ngClass in the template. This function determines the status of the stage
     *
     * @param currentstage the stage to be evaluated for which the class is queried.
     */
    public stageClass(currentstage) {
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
    public setActiveStage(stage) {
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
    public getStageLabel(stagedata) {
        if (stagedata.stage_label) {
            return this.language.getLabel(stagedata.stage_label);
        } else {
            return stagedata.stage_name;
        }
    }
}
