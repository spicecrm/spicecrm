/**
 * @module ObjectComponents
 */
import {Component, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {language} from "../../services/language.service";

@Component({
    selector: "object-action-newrelated-button",
    templateUrl: "./src/objectcomponents/templates/objectactionnewbutton.html",
    providers: [model]
})
export class ObjectActionNewrelatedButton implements OnInit {

    public parent: any = {};
    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private relatedmodels: relatedmodels) {

    }

    public ngOnInit() {
        this.model.module = this.relatedmodels.relatedModule;
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
            this.disabled = false;
        }
    }

    public execute() {

        if (!this.parent.data.id) {
            this.parent.data.id = this.parent.id;
        }

        // make sure we have no id so a new on gets issues
        this.model.id = "";

        // add the model
        this.model.addModel("", this.parent).subscribe(response => {
            if (response != false) {
                this.relatedmodels.addItems([response]);
            }
        });
    }

}
