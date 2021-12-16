/**
 * @module ObjectComponents
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";

@Component({
    selector: "object-action-new-button",
    templateUrl: "../templates/objectactionnewbutton.html",
    providers: [model]
})
export class ObjectActionNewButton implements OnInit {

    /**
     * set to true to disanble the button .. based on the ACL Check fdor the model
     */
    public disabled: boolean = true;

    /**
     * if set to true didpslay teh button as icon
     */
    public displayasicon: boolean = false;

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
