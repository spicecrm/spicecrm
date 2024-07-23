import { Component, EventEmitter, OnInit, Output } from "@angular/core";
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
}
