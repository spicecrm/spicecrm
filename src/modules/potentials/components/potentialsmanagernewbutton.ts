/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "potentials-manager-new-button",
    templateUrl: "./src/modules/potentials/templates/potentialsmanagernewbutton.html",
    providers: [model]
})
export class PotentialsManagerNewButton {

    @Input() private parent: any;
    @Input() private companyCode: string;

    constructor(public language: language, public metadata: metadata, public model: model) {
        this.model.module = 'Potentials';
    }

    public execute() {
        // make sure we have no idea so a new on gets issues
        this.model.id = "";
        this.model.addModel("", this.parent, {companycode_id: this.companyCode});
    }

}
