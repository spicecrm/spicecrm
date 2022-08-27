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
import {UserChangePasswordModal} from "./components/userchangepasswordmodal";
import {UserResetPasswordModal} from "./components/userresetpasswordmodal";
import {UserResetPasswordButton} from "./components/userresetpasswordbutton";
import {UserPreferences} from "./components/userpreferences";
import {UserRoles} from "./components/userroles";
import {UserRolesAddModal} from "./components/userrolesaddmodal";
import {UserAddButton} from "./components/useraddbutton";
import {UserAddModal} from "./components/useraddmodal";
import {UserPopoverHeader} from "./components/userpopoverheader";
import {UserDeactivateButton} from "./components/userdeactivatebutton";
import {UserDeactivateModal} from "./components/userdeactivatemodal";
import {UserDeactivateSelectUser} from "./components/userdeactivateselectuser";
import {UserSignature} from "./components/usersignature";

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
    declarations: [
        UserChangePasswordButton,
        UserChangePasswordModal,
        UserResetPasswordModal,
        UserResetPasswordButton,
        UserPreferences,
        UserRoles,
        UserRolesAddModal,
        UserAddButton,
        UserAddModal,
        UserPopoverHeader,
        UserDeactivateButton,
        UserDeactivateModal,
        UserDeactivateSelectUser,
        UserSignature
    ]
})
export class ModuleUsers {
}
