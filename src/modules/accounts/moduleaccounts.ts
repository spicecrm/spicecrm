/**
 * @module ModuleAccounts
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {ACManagerService} from "./services/acmanager.service";
import /*embed*/ { accountHierarchy } from "./services/accounthierarchy.service";

import /*embed*/ {AccountsKPIsOverview} from "./components/accountskpisoverview";
import /*embed*/ {AccountCCDetails} from "./components/accountccdetails";
import /*embed*/ {AccountCCDetailsTab} from "./components/accountccdetailstab";
import /*embed*/ {AccountTerritoryDetailsTab} from "./components/accountterritorydetailstab";
import /*embed*/ {AccountTerritoryDetails} from "./components/accountterritorydetails";
import /*embed*/ {ContactCCDetails} from "./components/contactccdetails";
import /*embed*/ {ContactCCDetailsTab} from "./components/contactccdetailstab";
import /*embed*/ {AccountsContactsManager} from "./components/accountscontactsmanager";
import /*embed*/ {AccountsContactsManagerDetails} from "./components/accountscontactsmanagerdetails";
import /*embed*/ {AccountsContactsManagerList} from "./components/accountscontactsmanagerlist";
import /*embed*/ {AccountHierarchy} from "./components/accounthierarchy";
import /*embed*/ {AccountHierarchyNode} from "./components/accounthierarchynode";
import /*embed*/ {AccountVATIDField} from "./components/accountvatidfield";

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
        AccountsKPIsOverview,
        AccountCCDetails,
        AccountCCDetailsTab,
        AccountTerritoryDetailsTab,
        AccountTerritoryDetails,
        ContactCCDetails,
        ContactCCDetailsTab,
        AccountsContactsManager,
        AccountsContactsManagerDetails,
        AccountsContactsManagerList,
        AccountHierarchy,
        AccountHierarchyNode,
        AccountVATIDField,
    ],
    providers: [
        ACManagerService
    ]
})
export class ModuleAccounts {}
