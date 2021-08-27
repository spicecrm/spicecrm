/**
 * @module ModuleACL
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {DirectivesModule}      from '../../directives/directives';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import /*embed*/ {ACLTypesManager} from "./components/acltypesmanager";
import /*embed*/ {ACLManagerHeader} from "./components/aclmanagerheader";
import /*embed*/ {ACLTypesManagerTypes} from "./components/acltypesmanagertypes";
import /*embed*/ {ACLTypesManagerTypesActions} from "./components/acltypesmanagertypesactions";
import /*embed*/ {ACLTypesManagerTypesFields} from "./components/acltypesmanagertypesfields";
import /*embed*/ {ACLTypesManagerTypesAddFields} from "./components/acltypesmanagertypesaddfields";
import /*embed*/ {ACLTypesManagerTypesAddAction} from "./components/acltypesmanagertypesaddaction";
import /*embed*/ {ACLObjectsManager} from "./components/aclobjectsmanager";
import /*embed*/ {ACLObjectsManagerObjects} from "./components/aclobjectsmanagerobjects";
import /*embed*/ {ACLObjectsManagerAddObjectModal} from "./components/aclobjectsmanageraddobjectmodal";
import /*embed*/ {ACLObjectsManagerObject} from "./components/aclobjectsmanagerobject";
import /*embed*/ {ACLObjectsManagerObjectDetails} from "./components/aclobjectsmanagerobjectdetails";
import /*embed*/ {ACLObjectsManagerObjectFieldvalues} from "./components/aclobjectsmanagerobjectfieldvalues";
import /*embed*/ {ACLObjectsManagerObjectFields} from "./components/aclobjectsmanagerobjectfields";

import /*embed*/ {ACLProfilesManager} from "./components/aclprofilesmanager";
import /*embed*/ {ACLProfilesManagerProfile} from "./components/aclprofilesmanagerprofile";
import /*embed*/ {ACLProfilesManagerProfiles} from "./components/aclprofilesmanagerprofiles";
import /*embed*/ {ACLProfilesManagerAddObjectModal} from "./components/aclprofilesmanageraddobjectmodal";
import /*embed*/ {ACLProfilesManagerAddProfileModal} from "./components/aclprofilesmanageraddprofilemodal";
import /*embed*/ {ACLUserProfiles} from "./components/acluserprofiles";

import /*embed*/ {fieldACLAdditionalUsers} from "./components/fieldacladditionalusers";

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
        ACLTypesManager,
        ACLManagerHeader,
        ACLTypesManagerTypes,
        ACLTypesManagerTypesActions,
        ACLTypesManagerTypesAddAction,
        ACLTypesManagerTypesFields,
        ACLTypesManagerTypesAddFields,
        ACLObjectsManager,
        ACLObjectsManagerObjects,
        ACLObjectsManagerAddObjectModal,
        ACLObjectsManagerObject,
        ACLObjectsManagerObjectDetails,
        ACLObjectsManagerObjectFieldvalues,
        ACLObjectsManagerObjectFields,
        ACLProfilesManager,
        ACLProfilesManagerProfiles,
        ACLProfilesManagerProfile,
        ACLProfilesManagerAddProfileModal,
        ACLProfilesManagerAddObjectModal,
        ACLUserProfiles,
        fieldACLAdditionalUsers
    ]
})
export class ModuleACL {}
