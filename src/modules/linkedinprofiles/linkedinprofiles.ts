/**
 * @module ModuleFolders
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import {LinkedInProfilesHeader} from "./components/linkedinprofileheader";
import {LinkedInProfilesPositions} from "./components/linkedinprofilepositions";


@NgModule( {
    imports: [
        CommonModule,
        FormsModule,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        LinkedInProfilesHeader,
        LinkedInProfilesPositions
    ]
})
export class ModuleLinkedInProfiles { }
