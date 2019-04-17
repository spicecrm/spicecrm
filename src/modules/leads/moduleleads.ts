/**
 * @module ModuleLeads
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ {LeadConvertButton} from './components/leadconvertbutton';
import /*embed*/ {LeadConvertModal} from './components/leadconvertmodal';
import /*embed*/ {LeadConvert} from './components/leadconvert';
import /*embed*/ {LeadConvertContact} from './components/leadconvertcontact';
import /*embed*/ {LeadConvertAccount} from './components/leadconvertaccount';
import /*embed*/ {LeadConvertAccountList} from './components/leadconvertaccountlist';
import /*embed*/ {LeadConvertAccountListItem} from './components/leadconvertaccountlistitem';
import /*embed*/ {LeadConvertOpportunity} from './components/leadconvertopportunity';
import /*embed*/ {LeadOpenLeadsDashlet} from './components/leadopenleadsdashlet';
import /*embed*/ {LeadConvertOpportunityModal} from './components/leadconvertopportunitymodal';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [

        LeadConvertButton,
        LeadConvertModal,
        LeadConvert,
        LeadConvertContact,
        LeadConvertAccount,
        LeadConvertAccountList,
        LeadConvertAccountListItem,
        LeadConvertOpportunity,
        LeadOpenLeadsDashlet,
        LeadConvertOpportunityModal
    ],
})
export class ModuleLeads {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(private vms: VersionManagerService,) {
        this.vms.registerModule(this);
    }
}