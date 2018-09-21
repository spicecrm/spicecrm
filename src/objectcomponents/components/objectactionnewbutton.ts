import {Component, Input, Optional, OnInit} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {language} from "../../services/language.service";

@Component({
    selector: "object-action-new-button",
    templateUrl: "./src/objectcomponents/templates/objectactionnewbutton.html",
    host: {
        "class": "slds-button slds-button--neutral",
        "(click)": "this.addModel()"
    },
    styles: [
        ":host {cursor:pointer;}"
    ]
})
export class ObjectActionNewButton implements OnInit {

    public parent: any = {};
    public module: string = "";

    constructor(private language: language, private metadata: metadata, private model: model) {

    }

    private addModel() {
        // make sure we have no idea so a new on gets issues
        this.model.id = "";
        this.model.addModel("", this.parent);
    }

    public ngOnInit() {
        this.model.module = this.module ? this.module : this.model.module;
    }

}