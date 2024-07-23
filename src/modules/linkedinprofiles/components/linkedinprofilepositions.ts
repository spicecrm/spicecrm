import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {model} from "../../../services/model.service";
import {relatedmodels} from "../../../services/relatedmodels.service";


/* @ignore */

@Component({
    selector: "linkedinprofiles-positions",
    templateUrl: "../templates/inkedinprofilepositions.html",
    providers: [relatedmodels]
})

export class LinkedInProfilesPositions  implements OnInit{

    constructor(
        public model: model,
        public relatedmodels: relatedmodels
    ) {
    }

    public ngOnInit() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        //this.relatedmodels.linkName = 'linkedinprofilepositions';
        // pass in the model
        this.relatedmodels.model = this.model;

        // set the related model from teh config
        this.relatedmodels.relatedModule = 'LinkedInProfilePositions';
        this.relatedmodels.getData();
    }

}
