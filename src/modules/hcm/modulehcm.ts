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
        HCMSkillMatrix
    ]
})
export class ModuleHCM {}
