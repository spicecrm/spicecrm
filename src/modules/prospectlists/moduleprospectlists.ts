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
        ProspectListsCreateTargetListFromModuleButton
    ]
})
export class ModuleProspectLists {}
