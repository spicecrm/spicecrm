/**
 * @module ObjectComponents
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";

@Component({
    selector: "object-action-new-button",
    templateUrl: "./src/objectcomponents/templates/objectactionnewbutton.html",
    providers: [model]
})
export class ObjectActionNewButton implements OnInit {

    public disabled: boolean = true;

    constructor(public language: language, public metadata: metadata, public model: model, @SkipSelf() public parentmodel: model) {

    }

    public execute() {
        // make sure we have no idea so a new on gets issues
        this.model.module = this.parentmodel.module;
        this.model.id = undefined;
        this.model.initialize();
        this.model.addModel("", this.parentmodel);
    }

    public ngOnInit() {
        if (this.parentmodel.module && this.metadata.checkModuleAcl(this.parentmodel.module, "create")) {
            this.disabled = false;
        }
    }
}
