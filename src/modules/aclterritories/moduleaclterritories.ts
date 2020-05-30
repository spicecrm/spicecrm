/**
 * @module ModuleACLTerritories
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {DirectivesModule}      from '../../directives/directives';

import /*embed*/ {ACLTerritoryTypeI} from "./interfaces/moduleaclterritories.interfaces";

import /*embed*/ {ACLTerritoriesNamePipe} from "./pipes/aclterritoriesname.pipe";
import /*embed*/ {fieldTerritorySecondaryPipe} from "./pipes/aclterritoriesfieldssecondary.pipe";

import /*embed*/ {ACLTerritorriesManager} from "./components/aclterritorriesmanager";
import /*embed*/ {ACLTerritorriesManagerHeader} from './components/aclterritorriesmanagerheader';
import /*embed*/ {ACLTerritorriesManagerTerritories} from "./components/aclterritorriesmanagerterritories";
import /*embed*/ {ACLTerritorriesManagerTerritory} from "./components/aclterritorriesmanagerterritory";
import /*embed*/ {ACLTerritorriesManagerTerritoryValues} from "./components/aclterritorriesmanagerterritoryvalues";
import /*embed*/ {ACLTerritorriesManagerTerritoryValue} from "./components/aclterritorriesmanagerterritoryvalue";
import /*embed*/ {ACLTerritorriesManagerTerritoryAddModal} from "./components/aclterritorriesmanagerterritoryaddmodal";
import /*embed*/ {ACLTerritorriesElementmanager} from './components/aclterritorrieselementmanager';
import /*embed*/ {ACLTerritorriesElementmanagerElements} from './components/aclterritorrieselementmanagerelements';
import /*embed*/ {ACLTerritorriesElementmanagerElementValues} from './components/aclterritorrieselementmanagerelementvalues';
import /*embed*/ {ACLTerritorriesElementmanagerElementsAddModal} from './components/aclterritorrieselementmanagerelementsaddmodal';
import /*embed*/ {ACLTerritorriesElementmanagerElementValuesAddModal} from "./components/aclterritorrieselementmanagerelementvaluesaddmodal";
import /*embed*/ {ACLTerritorriesTypesmanager} from "./components/aclterritorriestypesmanager";
import /*embed*/ {ACLTerritorriesTypesmanagerTypeElements} from "./components/aclterritorriestypesmanagertypeelements";
import /*embed*/ {AclterritorriesTypesmanagerTypes} from "./components/aclterritorriestypesmanagertypes";
import /*embed*/ {ACLTerritorriesTypesmanagerTypeelementsAddModal} from "./components/aclterritorriestypesmanagertypeelementsaddmodal";
import /*embed*/ {ACLTerritorriesModulessmanager} from "./components/aclterritorriesmodulesmanager";
import /*embed*/ {ACLTerritorriesModulesmanagerModules} from "./components/aclterritorriesmodulesmanagermodules";
import /*embed*/ {ACLTerritorriesModulesmanagerModulesAddModal} from "./components/aclterritorriesmodulesmanagermodulesaddmodal";

import /*embed*/ {ACLObjectsManagerObjectTerritories} from "./components/aclobjectsmanagerobjectterritories";
import /*embed*/ {ACLObjectsManagerObjectTerritoriesModal} from "./components/aclobjectsmanagerobjectterritoriesmodal";
import /*embed*/ {fieldTerritorySearch} from "./fields/fieldterritorysearch";
import /*embed*/ {fieldTerritory} from "./fields/fieldterritory";
import /*embed*/ {fieldTerritorySecondary} from "./fields/fieldterritorysecondary";
import /*embed*/ {fieldTerritoryRecent} from "./fields/fieldterritoryrecent";
import /*embed*/ {fieldTerritorySearchModal} from "./fields/fieldterritorysearchmodal";

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
export class ModuleACLTerritories {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
