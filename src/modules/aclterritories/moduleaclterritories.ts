/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
export class ModuleACLTerritories {}
