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
