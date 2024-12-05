import { Component, OnInit } from "@angular/core";
import {model} from "../../../services/model.service";
import {relatedmodels} from "../../../services/relatedmodels.service";


/* @ignore */

@Component({
    selector: "linkedinprofiles-educations",
    templateUrl: "../templates/linkedinprofileseducations.html",
    providers: [relatedmodels]
})

export class LinkedInProfilesEducations implements OnInit {

    public educations: any[] = [];

    public isLoading: boolean = true;

    constructor(
        public model: model,
        public relatedmodels: relatedmodels
    ) {
    }

    public ngOnInit() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        // pass in the model
        this.relatedmodels.model = this.model;

        // set the related model from the config
        this.relatedmodels.relatedModule = 'LinkedInProfileEducations';
        this.relatedmodels.getData().subscribe(data => {
            this.educations = this.relatedmodels.items;
            this.isLoading = false;
        });
    }

    public formatYear(dateString: string): string {
        const date = new Date(dateString);
        if(!dateString) return;
        return date.getFullYear().toString();
    }

}