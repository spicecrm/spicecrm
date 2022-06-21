/**
 * @module ModuleACLTerritories
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {DirectivesModule}      from '../../directives/directives';

import {ACLTerritoryTypeI} from "./interfaces/moduleaclterritories.interfaces";

import {ACLTerritoriesNamePipe} from "./pipes/aclterritoriesname.pipe";
import {fieldTerritorySecondaryPipe} from "./pipes/aclterritoriesfieldssecondary.pipe";

import {ACLTerritorriesManager} from "./components/aclterritorriesmanager";
import {ACLTerritorriesManagerHeader} from './components/aclterritorriesmanagerheader';
import {ACLTerritorriesManagerTerritories} from "./components/aclterritorriesmanagerterritories";
import {ACLTerritorriesManagerTerritory} from "./components/aclterritorriesmanagerterritory";
import {ACLTerritorriesManagerTerritoryValues} from "./components/aclterritorriesmanagerterritoryvalues";
import {ACLTerritorriesManagerTerritoryValue} from "./components/aclterritorriesmanagerterritoryvalue";
import {ACLTerritorriesManagerTerritoryAddModal} from "./components/aclterritorriesmanagerterritoryaddmodal";
import {ACLTerritorriesElementmanager} from './components/aclterritorrieselementmanager';
import {ACLTerritorriesElementmanagerElements} from './components/aclterritorrieselementmanagerelements';
import {ACLTerritorriesElementmanagerElementValues} from './components/aclterritorrieselementmanagerelementvalues';
import {ACLTerritorriesElementmanagerElementsAddModal} from './components/aclterritorrieselementmanagerelementsaddmodal';
import {ACLTerritorriesElementmanagerElementValuesAddModal} from "./components/aclterritorrieselementmanagerelementvaluesaddmodal";
import {ACLTerritorriesTypesmanager} from "./components/aclterritorriestypesmanager";
import {ACLTerritorriesTypesmanagerTypeElements} from "./components/aclterritorriestypesmanagertypeelements";
import {AclterritorriesTypesmanagerTypes} from "./components/aclterritorriestypesmanagertypes";
import {ACLTerritorriesTypesmanagerTypeelementsAddModal} from "./components/aclterritorriestypesmanagertypeelementsaddmodal";
import {ACLTerritorriesModulessmanager} from "./components/aclterritorriesmodulesmanager";
import {ACLTerritorriesModulesmanagerModules} from "./components/aclterritorriesmodulesmanagermodules";
import {ACLTerritorriesModulesmanagerModulesAddModal} from "./components/aclterritorriesmodulesmanagermodulesaddmodal";

import {ACLObjectsManagerObjectTerritories} from "./components/aclobjectsmanagerobjectterritories";
import {ACLObjectsManagerObjectTerritoriesModal} from "./components/aclobjectsmanagerobjectterritoriesmodal";
import {fieldTerritorySearch} from "./fields/fieldterritorysearch";
import {fieldTerritory} from "./fields/fieldterritory";
import {fieldTerritorySecondary} from "./fields/fieldterritorysecondary";
import {fieldTerritoryRecent} from "./fields/fieldterritoryrecent";
import {fieldTerritorySearchModal} from "./fields/fieldterritorysearchmodal";

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
        ACLTerritoriesNamePipe,
        ACLTerritorriesManager,
        ACLTerritorriesManagerHeader,
        ACLTerritorriesManagerTerritories,
        ACLTerritorriesManagerTerritory,
        ACLTerritorriesManagerTerritoryValues,
        ACLTerritorriesManagerTerritoryValue,
        ACLTerritorriesManagerTerritoryAddModal,
        ACLTerritorriesElementmanager,
        ACLTerritorriesElementmanagerElements,
        ACLTerritorriesElementmanagerElementValues,
        ACLTerritorriesElementmanagerElementsAddModal,
        ACLTerritorriesElementmanagerElementValuesAddModal,
        ACLTerritorriesTypesmanager,
        AclterritorriesTypesmanagerTypes,
        ACLTerritorriesTypesmanagerTypeElements,
        ACLTerritorriesTypesmanagerTypeelementsAddModal,
        ACLTerritorriesModulessmanager,
        ACLTerritorriesModulesmanagerModules,
        ACLTerritorriesModulesmanagerModulesAddModal,
        ACLObjectsManagerObjectTerritories,
        ACLObjectsManagerObjectTerritoriesModal,
        fieldTerritory,
        fieldTerritorySearch,
        fieldTerritoryRecent,
        fieldTerritorySecondary,
        fieldTerritorySecondaryPipe,
        fieldTerritorySearchModal
    ]
})
export class ModuleACLTerritories {}
