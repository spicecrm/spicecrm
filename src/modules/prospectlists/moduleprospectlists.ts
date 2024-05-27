/**
 * @module ModuleProspectLists
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {DirectivesModule} from "../../directives/directives";

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import {ProspectListsCreateTargetListFromModuleModal} from './components/prospectlistscreatetargetlistfrommodulemodal';
import {ProspectListsCreateTargetListFromModuleButton} from './components/prospectlistscreatetargetlistfrommodulebutton';
import {ProspectListsActionSelectButton} from "./components/prospectlistsactionselectbutton";
import {ProspectListsSetTargetsEmailAddressModal} from "./components/prospectlistssettargetsemailaddressmodal";
import {ProspectListsPersonEmailAddressField} from "./components/prospectlistspersonemailaddressfield";
import {ProspectListCountField} from "./fields/prospectlistscountfield";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        ProspectListsCreateTargetListFromModuleModal,
        ProspectListsCreateTargetListFromModuleButton,
        ProspectListsActionSelectButton,
        ProspectListsSetTargetsEmailAddressModal,
        ProspectListsPersonEmailAddressField,
        ProspectListCountField
    ]
})
export class ModuleProspectLists {}
