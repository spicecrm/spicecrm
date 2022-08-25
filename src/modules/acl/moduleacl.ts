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

import {ACLTypesManager} from "./components/acltypesmanager";
import {ACLManagerHeader} from "./components/aclmanagerheader";
import {ACLTypesManagerTypes} from "./components/acltypesmanagertypes";
import {ACLTypesManagerTypesActions} from "./components/acltypesmanagertypesactions";
import {ACLTypesManagerTypesFields} from "./components/acltypesmanagertypesfields";
import {ACLTypesManagerTypesAddFields} from "./components/acltypesmanagertypesaddfields";
import {ACLTypesManagerTypesAddAction} from "./components/acltypesmanagertypesaddaction";
import {ACLObjectsManager} from "./components/aclobjectsmanager";
import {ACLObjectsManagerObjects} from "./components/aclobjectsmanagerobjects";
import {ACLObjectsManagerAddObjectModal} from "./components/aclobjectsmanageraddobjectmodal";
import {ACLObjectsManagerObject} from "./components/aclobjectsmanagerobject";
import {ACLObjectsManagerObjectDetails} from "./components/aclobjectsmanagerobjectdetails";
import {ACLObjectsManagerObjectFieldvalues} from "./components/aclobjectsmanagerobjectfieldvalues";
import {ACLObjectsManagerObjectFields} from "./components/aclobjectsmanagerobjectfields";

import {ACLProfilesManager} from "./components/aclprofilesmanager";
import {ACLProfilesManagerProfile} from "./components/aclprofilesmanagerprofile";
import {ACLProfilesManagerProfiles} from "./components/aclprofilesmanagerprofiles";
import {ACLProfilesManagerAddObjectModal} from "./components/aclprofilesmanageraddobjectmodal";
import {ACLProfilesManagerAddProfileModal} from "./components/aclprofilesmanageraddprofilemodal";
import {ACLUserProfiles} from "./components/acluserprofiles";

import {fieldACLAdditionalUsers} from "./components/fieldacladditionalusers";

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
