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
import /*embed*/ {UserPreferencesItem} from "./components/userpreferencesitem";
import /*embed*/ {UserPreferencesItemDisplay} from "./components/userpreferencesitemdisplay";
import /*embed*/ {UserPreferencesItemEdit} from "./components/userpreferencesitemedit";
import /*embed*/ {UserPopoverHeader} from "./components/userpopoverheader";
import /*embed*/ {UserDeactivateButton} from "./components/userdeactivatebutton";
import /*embed*/ {UserDeactivateModal} from "./components/userdeactivatemodal";
import /*embed*/ {UserDeactivateSelectUser} from "./components/userdeactivateselectuser";

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
        UserPreferencesItem,
        UserPreferencesItemDisplay,
        UserPreferencesItemEdit,
        UserPopoverHeader,
        UserDeactivateButton,
        UserDeactivateModal,
        UserDeactivateSelectUser
    ]
})
export class ModuleUsers {
}
