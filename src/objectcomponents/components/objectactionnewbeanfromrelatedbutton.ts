/**
 * @module ObjectComponents
 */
import {Component, Inject, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";

@Component({
    selector: "object-action-new-bean-from-related-button",
    templateUrl: "./src/objectcomponents/templates/objectactionnewbeanfromrelatedbutton.html",
    providers: [{provide: 'modelnew', useClass: model}]
})
export class ObjectActionNewBeanFromRelatedButton implements OnInit {

    public parent: any = {};
    public disabled: boolean = false;
    public actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, private modelnew: model) {

    }

    public ngOnInit() {


        // this.relatedmodels
        // this.model.module = this.relatedmodels.relatedModule;
        // if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "create")) {
        //     this.disabled = false;
        // }
    }

    public execute() {

    this.modelnew.module = this.actionconfig.module;
    this.modelnew.addModel("", this.model);


    console.log("this.model_", this.model);
    console.log("this.actionconfig.module", this.actionconfig.module);
    console.log("parent", parent);



        // if (!this.parent.data.id) {
        //     this.parent.data.id = this.parent.id;
        // }
        //
        // // make sure we have no id so a new on gets issues
        // this.model.id = "";
        //
        // // add the model
        // this.model.addModel("", this.model).subscribe(response => {
        //     if (response != false) {
        //         this.relatedmodels.addItems([response]);
        //     }
        // });
    }
}
