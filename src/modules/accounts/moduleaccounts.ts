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

import {ACManagerService} from "./services/acmanager.service";
import { accountHierarchy } from "./services/accounthierarchy.service";

import {AccountsKPIsOverview} from "./components/accountskpisoverview";
import {AccountCCDetails} from "./components/accountccdetails";
import {AccountCCDetailsTab} from "./components/accountccdetailstab";
import {AccountTerritoryDetailsTab} from "./components/accountterritorydetailstab";
import {AccountTerritoryDetails} from "./components/accountterritorydetails";
import {ContactCCDetails} from "./components/contactccdetails";
import {ContactCCDetailsTab} from "./components/contactccdetailstab";
import {AccountsContactsManager} from "./components/accountscontactsmanager";
import {AccountsContactsManagerDetails} from "./components/accountscontactsmanagerdetails";
import {AccountsContactsManagerList} from "./components/accountscontactsmanagerlist";
import {AccountHierarchy} from "./components/accounthierarchy";
import {AccountHierarchyNode} from "./components/accounthierarchynode";
import {AccountVATIDField} from "./components/accountvatidfield";

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
