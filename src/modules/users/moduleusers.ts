/**
 * @module ModuleUsers
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {UserChangePasswordButton} from "./components/userchangepasswordbutton";
import {UserResetPasswordModal} from "./components/userresetpasswordmodal";
import {UserResetPasswordButton} from "./components/userresetpasswordbutton";
import {UserPreferences} from "./components/userpreferences";
import {UserRoles} from "./components/userroles";
import {UserRolesAddModal} from "./components/userrolesaddmodal";
import {UserAddButton} from "./components/useraddbutton";
import {UserAddModal} from "./components/useraddmodal";
import {UserCreateFromBeanButton} from "./components/usercreatefrombeanbutton";
import {UserCreateFromBeanModal} from "./components/usercreatefrombeanmodal";
import {UserPopoverHeader} from "./components/userpopoverheader";
import {UserDeactivateButton} from "./components/userdeactivatebutton";
import {UserDeactivateModal} from "./components/userdeactivatemodal";
import {UserDeactivateSelectUser} from "./components/userdeactivateselectuser";
import {UserSignature} from "./components/usersignature";
import {UserPreferencesModal} from "./components/userpreferencesmodal";
import {UserSignatureModal} from "./components/usersignaturemodal";
import {UserCreateRoles} from "./components/usercreateroles";
import {UserCreateProfiles} from "./components/usercreateprofiles";
import {UserCreatePassword} from "./components/usercreatepassword";
import {UserSet2FAModal} from "./components/userset2famodal";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    exports: [
        UserPreferences
    ],
    declarations: [
        UserChangePasswordButton,
        UserResetPasswordModal,
        UserResetPasswordButton,
        UserPreferences,
        UserPreferencesModal,
        UserSignatureModal,
        UserRoles,
        UserRolesAddModal,
        UserAddButton,
        UserAddModal,
        UserCreateFromBeanButton,
        UserCreateFromBeanModal,
        UserCreatePassword,
        UserCreateRoles,
        UserCreateProfiles,
        UserPopoverHeader,
        UserDeactivateButton,
        UserDeactivateModal,
        UserDeactivateSelectUser,
        UserSignature,
        UserSet2FAModal
    ]
})
export class ModuleUsers {
}
