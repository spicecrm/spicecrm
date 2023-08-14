/**
 * @module ObjectComponents
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {language} from "../../services/language.service";

@Component({
    selector: "object-action-newrelated-button",
    templateUrl: "../templates/objectactionnewbutton.html",
    providers: [model]
})
export class ObjectActionNewrelatedButton implements OnInit {

    public disabled: boolean = true;

    public actionconfig: {required_model_state?: string};
    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

    constructor(@SkipSelf() public parent: model, public language: language, public metadata: metadata, public model: model, public relatedmodels: relatedmodels) {

    }

    public ngOnInit() {
        this.model.module = this.relatedmodels.relatedModule;
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create") && (!this.actionconfig?.required_model_state || this.model.checkModelState(this.actionconfig.required_model_state))) {
            this.disabled = false;
        }
    }

    public execute() {

        if (!this.parent.getField('id')) {
            this.parent.setField('id', this.parent.id);
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
