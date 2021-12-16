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

import /*embed*/ {UserChangePasswordButton} from "./components/userchangepasswordbutton";
import /*embed*/ {UserChangePasswordModal} from "./components/userchangepasswordmodal";
import /*embed*/ {UserResetPasswordModal} from "./components/userresetpasswordmodal";
import /*embed*/ {UserResetPasswordButton} from "./components/userresetpasswordbutton";
import /*embed*/ {UserPreferences} from "./components/userpreferences";
import /*embed*/ {UserRoles} from "./components/userroles";
import /*embed*/ {UserRolesAddModal} from "./components/userrolesaddmodal";
import /*embed*/ {UserAddButton} from "./components/useraddbutton";
import /*embed*/ {UserAddModal} from "./components/useraddmodal";
import /*embed*/ {UserPopoverHeader} from "./components/userpopoverheader";
import /*embed*/ {UserDeactivateButton} from "./components/userdeactivatebutton";
import /*embed*/ {UserDeactivateModal} from "./components/userdeactivatemodal";
import /*embed*/ {UserDeactivateSelectUser} from "./components/userdeactivateselectuser";
import /*embed*/ {UserSignature} from "./components/usersignature";

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
