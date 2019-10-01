/**
 * @module ModuleSpicePath
 */
import {Component, Input, AfterViewInit, OnInit, Output, EventEmitter} from "@angular/core";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {broadcast} from "../../../services/broadcast.service";

/**
 * renders a path in the context of a model
 *
 * the component embedding this component needs to provide a model
 */
@Component({
    selector: "spice-path-track",
    templateUrl: "./src/include/spicepath/templates/spicepathtrack.html",
})
export class SpicePathTrack {

    /**
     * holds the current active stage if the user clicks on another stage
     */
    private activeStage: string;

    /**
     * emits the curetn stage
     */
    @Output() private activeStage$: EventEmitter<string> = new EventEmitter<string>();

    constructor(private configuration: configurationService, private model: model, private language: language) {

    }

    /**
     * returns teh stages for the module from teh configuration service
     */
    get stages() {
        return this.configuration.getData('spicebeanguides') ? this.configuration.getData('spicebeanguides')[this.model.module].stages : [];
    }

    /**
     * retzurns the field on the model that holds the status that is used for the path
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
        // if we are on teh first stage we are incomplete and can return
        let itemClass = 'slds-is-complete';
        for (let stage of this.stages) {
            if (stage.stage == this.model.getField(this.statusfield)) {
                itemClass = 'slds-is-current';
            } else {
                if (itemClass == 'slds-is-current') {
                    itemClass = 'slds-is-incomplete';
                }
            }

            if (stage.stage == currentstage) {
                break;
            }
        }

        // in case we are the acive item set the add class. Special handling for the current one .. both classes conflict so just set one
        if ((this.activeStage && this.activeStage == currentstage) || (!this.activeStage && this.model.getField(this.statusfield) == currentstage)) {
            if (itemClass == 'slds-is-current') {
                itemClass = 'slds-is-active';
            } else {
                itemClass += ' slds-is-active';
            }
        }

        return itemClass;
    }

    /**
     * called from the template when the stage is clicked in the path
     *
     * @param stage the selected stage
     */
    private setActiveStage(stage) {
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
