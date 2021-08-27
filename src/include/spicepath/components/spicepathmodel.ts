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

}
