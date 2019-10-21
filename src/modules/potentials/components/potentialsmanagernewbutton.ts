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

    /**
     * the parent model in which context we are
     */
    @Input() private parent: any;

    /**
     * the input for the companycode. This is passed in when the new potential is created
     */
    @Input() private companyCode: string;

    /**
     * set if the button is disabled
     */
    private disabled: boolean = true;

    constructor(public language: language, public metadata: metadata, public model: model) {
        this.model.module = 'Potentials';

        // check if we can add a Poential
        if (this.metadata.checkModuleAcl('Potentials', 'create')) {
            this.disabled = false;
        }
    }

    /**
     * executes the click
     */
    public execute() {
        if (this.disabled) return;

        // make sure we have no idea so a new on gets issues
        this.model.id = "";
        this.model.addModel("", this.parent, {companycode_id: this.companyCode});
    }

}
