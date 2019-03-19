/**
 * @module ModuleSpicePath
 */
import {Component, Input, AfterViewInit, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";
import {broadcast} from "../../../services/broadcast.service";

/**
 * renders a path in the context of a model
 *
 * the component embedding this component needs to provide a model
 */
@Component({
    selector: "spice-path-model",
    templateUrl: "./src/include/spicepath/templates/spicepathmodel.html",
})
export class SpicePathModel {

    constructor(private configuration: configurationService, private model: model) {

    }

    /**
     * returns teh stages for the module from teh configuration service
     */
    get stages() {
        return this.configuration.getData('spicebeanguides')[this.model.module].stages;
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
                itemClass = 'slds-is-active';
            } else {
                if (itemClass == 'slds-is-active') {
                    itemClass = 'slds-is-incomplete';
                }
            }

            if (stage.stage == currentstage) {
                break;
            }
        }
        return itemClass;
    }

}
