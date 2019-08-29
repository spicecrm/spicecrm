/**
 * @module ObjectComponents
 */
import {Component, Directive, Inject, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";


@Directive({
    selector: "object-action-new-bean-from-related-button-model-helper",
    providers: [model]
})
export class ObjectActionNewBeanFromRelatedButtonModelHelper {
    constructor(public model: model) {}
}


@Component({
    selector: "object-action-new-bean-from-related-button",
    templateUrl: "./src/objectcomponents/templates/objectactionnewbeanfromrelatedbutton.html",
})
export class ObjectActionNewBeanFromRelatedButton implements OnInit {

    // To provide a new model, we need a child component!
    @ViewChild(ObjectActionNewBeanFromRelatedButtonModelHelper, {static: true}) private child;

    public parent: any = {};
    public disabled: boolean = true;
    public actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal) {

    }

    public ngOnInit() {
        // check acl
        if (this.actionconfig.module && this.metadata.checkModuleAcl(this.actionconfig.module, "create")) {
            this.disabled = false;
        }
    }

    public execute() {
        // Set the module of the new model and open a modal with copy rules
        this.child.model.module = this.actionconfig.module;
        this.child.model.addModel("", this.model);
    }
}



