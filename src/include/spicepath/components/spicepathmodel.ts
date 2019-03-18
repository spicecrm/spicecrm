/**
 * @module ModuleSpicePath
 */
import {Component, Input, AfterViewInit, OnInit} from "@angular/core";
import {model} from "../../../services/model.service";
import {configurationService} from "../../../services/configuration.service";
import {broadcast} from "../../../services/broadcast.service";

@Component({
    selector: "spice-path-model",
    templateUrl: "./src/include/spicepath/templates/spicepathmodel.html",
})
export class SpicePathModel {

    constructor(private configuration: configurationService, private model: model) {

    }

    get stages() {
        return this.configuration.getData('spicebeanguides')[this.model.module].stages;
    }

    get statusfield() {
        return this.configuration.getData('spicebeanguides')[this.model.module].statusfield;
    }

    private stageClass(currentstage) {
        console.log(currentstage);
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
        console.log('returning final ' + this.model.getField(this.statusfield) + ' ' + currentstage + ' ' + itemClass);
        return itemClass;
    }

}
