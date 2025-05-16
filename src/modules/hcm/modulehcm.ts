/**
 * @module ModuleHome
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {ModuleActivities} from "../activities/moduleactivities";

import {HCMSkillMatrix} from "./components/hcmskillmatrix";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {HCMSkillManager} from "./components/hcmskillmanager";
import {HCMSkillManagerButton} from "./components/hcmskillmanagerbutton";
import {HCMJobProfileSkillPanel} from "./components/hcmjobprofileskillpanel";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleActivities,
        CdkDropList
    ],
    declarations: [
        HCMSkillMatrix,
        HCMSkillManagerButton,
        HCMSkillManager,
        HCMJobProfileSkillPanel
    ]
})
export class ModuleHCM {}
