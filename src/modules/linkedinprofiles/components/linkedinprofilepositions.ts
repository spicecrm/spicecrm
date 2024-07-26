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

    public jobPositions :any[] = [];

    public isLoading :boolean = true;

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
        this.relatedmodels.loaditems = -99;
        this.relatedmodels.sort = {
            sortfield: 'date_start',
            sortdirection: 'desc'
        }

        // set the related model from the config
        this.relatedmodels.relatedModule = 'LinkedInProfilePositions';
        this.relatedmodels.getData().subscribe(data => {
            this.jobPositions = this.relatedmodels.items;
            this.isLoading = false;
        });
    }

    public formatYearMonthName(dateString: string): string {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[date.getMonth()];
        return `${monthName} ${year}`;
    }

    public calculateDuration(startDate: string, endDate: string | null): string {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0 || (months === 0 && end.getDate() < start.getDate())) {
            years--;
            months += 12;
        }

        if (end.getDate() < start.getDate()) {
            months--;
        }

        let result = '';
        if (years > 0) {
            result += `${years} yr${years > 1 ? 's' : ''} `;
        }
        if (months > 0) {
            result += `${months} mo${months > 1 ? 's' : ''}`;
        }

        return result.trim();
    }

}
