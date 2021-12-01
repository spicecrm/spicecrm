/**
 * @module ModulePipl
 */
import {Component, Input, HostBinding} from "@angular/core";
import {Router} from "@angular/router";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "pipl-container",
    templateUrl: "../templates/piplcontainer.html"
})
export class PiplContainer {

    public self: any = {};

    constructor(public language: language, public backend: backend, public metadata: metadata, public model: model) {

    }

}
