/**
 * @module ObjectComponents
 */
import {Component, Directive, Inject, OnInit, Optional, ViewChild} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {relatedmodels} from "../../services/relatedmodels.service";

/**
 * a helper component used in ObjectActionNewCopyRuleBeanButton
 *
 * does nothing but provide a model
 */
@Directive({
    selector: "object-action-new-copy-rule-bean-button-model-helper",
    providers: [model]
})
export class ObjectActionNewCopyRuleBeanButtonModelHelper {
    constructor(public model: model) {
    }
}

/**
 * adds a button that crteates a new model by copying from the model in teh scope and also from teh related model if one is found
 *
 * actionconfig required! Example: '{ "module": "Calls", "label": "LBL_ADD_CALL" }'
 */
@Component({
    selector: "object-action-new-copy-rule-bean-button",
    templateUrl: "../templates/objectactionnewcopyrulebeanbutton.html",
})
export class ObjectActionNewCopyRuleBeanButton implements OnInit {

    /**
     * this is a helper so we have a subcomponent that can provide a new model
     *
     * this model is detected via teh component and then addressed
     */
    @ViewChild(ObjectActionNewCopyRuleBeanButtonModelHelper, {static: true}) public child;

    /**
     * the parent model in which the action is happening
     */
    public parent: any = {};

    /**
     * if the button is disabled
     */
    public disabled: boolean = true;

    /**
     * the actzion config from the actionset
     */
    public actionconfig: any = {};

    constructor(public language: language, public metadata: metadata, public model: model, @Optional() public relatedmodels: relatedmodels) {

    }

    /**
     * initialize and determine if we can add fopr that type of model with the users ACL
     */
    public ngOnInit() {
        // check acl
        if (this.actionconfig.module && this.metadata.checkModuleAcl(this.actionconfig.module, "create")) {
            this.disabled = false;
        }
    }

    /**
     * execute the button action
     */
    public execute() {
        // Set the module of the new model and open a modal with copy rules
        this.child.model.module = this.actionconfig.module;

        // set the parents
        let parents = [this.parent];
        if (this.relatedmodels && this.relatedmodels.model) parents.push(this.relatedmodels.model);

        this.child.model.addModel("", parents);
    }
}



