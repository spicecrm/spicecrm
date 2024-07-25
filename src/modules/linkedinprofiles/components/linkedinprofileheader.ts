import { Component } from "@angular/core";
import {model} from "../../../services/model.service";


/* @ignore */

@Component({
    selector: "linkedinprofiles-header",
    templateUrl: "../templates/inkedinprofilesheader.html"
})

export class LinkedInProfilesHeader  {

    constructor(
        public model: model
    ) {
    }

    public cssStyles() {
        return {
            'border-radius': '50%',
            'margin-top': '-100px',
            'margin-left': '30px',
            'width': '150px',
            'border-width': '5px',
            'border-color': 'white',
            'border-style': 'solid'
        }
    }
}
